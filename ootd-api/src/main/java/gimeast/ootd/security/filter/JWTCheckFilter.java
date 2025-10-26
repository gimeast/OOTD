package gimeast.ootd.security.filter;

import gimeast.ootd.member.entity.MemberEntity;
import gimeast.ootd.member.repository.MemberRepository;
import gimeast.ootd.security.auth.CustomUserPrincipal;
import gimeast.ootd.security.util.JWTUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Log4j2
public class JWTCheckFilter extends OncePerRequestFilter {
    private final JWTUtil jwtUtil;
    private final MemberRepository memberRepository;


    /**
     * JWTCheckFilter가 동작하지 않아야 하는 경로를 지정하기 위해 사용
     * @param request
     * @return
     * @throws ServletException
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();

        // /api/v1/auth/me는 토큰 검증 필요
        if (path.equals("/api/v1/auth/me")) {
            return false;
        }

        // auth API는 모두 허용 (login, join 등)
        if (path.startsWith("/api/v1/auth/")) {
            return true;
        }

        // hashtag API는 모두 허용 (인증 불필요)
        if (path.startsWith("/api/v1/hashtag/")) {
            return true;
        }

        // /api/v1/ootd/search API는 모두 허용 (인증 불필요)
        if (path.startsWith("/api/v1/ootd/search")) {
            return true;
        }

        // API가 아닌 경로는 필터링하지 않음
        if (!path.startsWith("/api/")) {
            return true;
        }

        return false;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        log.info("JWTCheckFilter doFilter.........");
        log.info("requestURI: {}", request.getRequestURI());

        // 쿠키에서 Access Token 추출
        String accessToken = getCookieValue(request, "accessToken");
        log.info("accessToken from cookie: {}", accessToken);

        //Access Token이 없는 경우
        if (accessToken == null) {
            // GET /api/v1/ootd는 토큰 없이도 허용 (비로그인 사용자도 조회 가능)
            String path = request.getRequestURI();
            String method = request.getMethod();
            if ("GET".equals(method) && path.equals("/api/v1/ootd")) {
                log.info("Allowing unauthenticated access to GET /api/v1/ootd");
                filterChain.doFilter(request, response);
                return;
            }

            handleException(response, new Exception("ACCESS TOKEN NOT FOUND"));
            return;
        }

        try {
            Map<String, Object> tokenMap = jwtUtil.validateToken(accessToken);
            //토큰 검증 결과에 문제가 없다면
            log.info("tokenMap: {}", tokenMap);

            Long memberIdx = Long.valueOf(tokenMap.get("idx").toString());

            Optional<MemberEntity> memberOptional = memberRepository.findByIdWithRoles(memberIdx);

            if (memberOptional.isEmpty()) {
                handleException(response, new Exception("MEMBER NOT FOUND"));
                return;
            }

            MemberEntity member = memberOptional.get();
            String[] roles = member.getRoleSet().stream()
                    .map(Enum::name)
                    .toArray(String[]::new);

            //토큰 검증 결과를 이용해서 Authentication 객체를 생성
            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(
                            new CustomUserPrincipal(member.getIdx(), member.getEmail()),
                            null,
                            Arrays.stream(roles)
                                    .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                                    .collect(Collectors.toList())
                    );

            //SecurityContextHolder에 Authentication 객체를 저장
            //이후에 SecurityContextHolder를 이용해서 Authentication 객체를 꺼내서 사용할 수 있다.
            SecurityContext context = SecurityContextHolder.getContext();
            context.setAuthentication(authenticationToken);

            filterChain.doFilter(request, response);
        } catch (Exception e) {
            handleException(response, e);
        }
    }

    private String getCookieValue(HttpServletRequest request, String cookieName) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookieName.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    private void handleException(HttpServletResponse response, Exception e) throws IOException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");
        response.getWriter().println("{\"error\": \"" + e.getMessage() + "\"}");
    }
}
