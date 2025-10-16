package gimeast.ootd.security.controller;

import gimeast.ootd.member.dto.MemberDTO;
import gimeast.ootd.member.service.MemberService;
import gimeast.ootd.security.service.RefreshTokenService;
import gimeast.ootd.security.util.JWTUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@Log4j2
@RequiredArgsConstructor
public class AuthController {

    private final JWTUtil jwtUtil;

    @Value("${cookie.secure}")
    private boolean cookieSecure;

    @Value("${cookie.same-site:Lax}")
    private String cookieSameSite;

    @Value("${jwt.refresh-token.min}")
    private int refreshTokenMin;

    private final MemberService memberService;
    private final RefreshTokenService refreshTokenService;

    @PostMapping("/join")
    public ResponseEntity<Map<String, Object>> join(@RequestBody MemberDTO memberDTO) {
        memberService.join(memberDTO);
        return ResponseEntity.ok(Map.of("message", "Join successful", "isSuccess",true));
    }

    @PostMapping("/join/check/email")
    public ResponseEntity<Map<String, Boolean>> checkEmailDuplicate(@RequestBody MemberDTO memberDTO) {
        boolean isAvailable = memberService.isEmailAvailable(memberDTO.getEmail());
        return ResponseEntity.ok(Map.of("available", isAvailable));
    }

    @PostMapping("/join/check/nickname")
    public ResponseEntity<Map<String, Boolean>> checkNicknameDuplicate(@RequestBody MemberDTO memberDTO) {
        boolean isAvailable = memberService.isNicknameAvailable(memberDTO.getNickname());
        return ResponseEntity.ok(Map.of("available", isAvailable));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> makeToken(@RequestBody MemberDTO memberDTO, HttpServletResponse response) {
        log.info("make token..........");

        MemberDTO memberDTOResult = memberService.read(memberDTO.getEmail(), memberDTO.getPassword());
        log.info("memberDTOResult: {}", memberDTOResult);

        Map<String, String> tokenMap = refreshTokenService.makeTokenMap(memberDTOResult);
        setTokenCookies(response, tokenMap);

        return ResponseEntity.ok(Map.of("message", "Login successful", "user",memberDTOResult.getDataMap()));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        log.info("Get current user info..........");

        // 쿠키에서 Access Token 추출
        String accessToken = getCookieValue(request, "accessToken");

        try {
            // Access Token 검증 및 사용자 정보 추출
            Map<String, Object> claims = jwtUtil.validateToken(accessToken);
            Long memberIdx = Long.valueOf(claims.get("idx").toString());

            log.info("Current user idx: {}", memberIdx);

            // 사용자 정보 조회
            MemberDTO memberDTO = memberService.getByIdx(memberIdx);

            // 로그인 API와 동일한 형식으로 반환
            return ResponseEntity.ok(memberDTO.getDataMap());

        } catch (Exception e) {
            log.error("Failed to get current user: {}", e.getMessage());
            return ResponseEntity.status(401)
                    .body(Map.of(
                            "message", "인증이 필요합니다.",
                            "error", "Unauthorized"
                    ));
        }
    }

    @PostMapping("/token/refresh")
    public ResponseEntity<Map<String, String>> refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        log.info("refresh token request..........");

        // 쿠키에서 Access Token 추출 (만료된 토큰에서 idx 추출용)
        String accessToken = getCookieValue(request, "accessToken");

        if (accessToken == null) {
            return handleException("No Access Token", 400);
        }

        log.info("access token from cookie............{}", accessToken);

        try {
            // Access Token에서 idx 추출 (만료되어도 가능)
            Map<String, Object> claims = jwtUtil.getClaims(accessToken);
            Long memberIdx = Long.valueOf(claims.get("idx").toString());

            log.info("Refresh token for memberIdx: {}", memberIdx);

            // DB에서 저장된 Refresh Token 조회 및 검증
            Map<String, String> tokenMap = refreshTokenService.refreshAccessToken(memberIdx);
            setTokenCookies(response, tokenMap);

            return ResponseEntity.ok(Map.of("message", "Token refreshed successfully"));
        } catch (Exception e) {
            log.error("Token refresh failed: {}", e.getMessage());
            return handleException("REFRESH " + e.getMessage(), 400);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        log.info("logout request..........");

        // 쿠키에서 Access Token 추출
        String accessToken = getCookieValue(request, "accessToken");

        if (accessToken != null) {
            try {
                // Access Token에서 idx 추출
                Map<String, Object> claims = jwtUtil.getClaims(accessToken);
                Long memberIdx = Long.valueOf(claims.get("idx").toString());

                // DB에서 Refresh Token 삭제
                refreshTokenService.deleteRefreshToken(memberIdx);

                log.info("Logout successful for memberIdx: {}", memberIdx);
            } catch (Exception e) {
                log.warn("Failed to extract memberIdx from token during logout: {}", e.getMessage());
            }
        }

        // HttpOnly 쿠키 삭제 (maxAge=0)
        ResponseCookie deleteCookie = ResponseCookie.from("accessToken", "")
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/")
                .maxAge(0)
                .sameSite(cookieSameSite)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, deleteCookie.toString());

        return ResponseEntity.ok(Map.of(
                "message", "Logout successful",
                "isSuccess", true
        ));
    }

    private void setTokenCookies(HttpServletResponse response, Map<String, String> tokenMap) {
        // Access Token만 HttpOnly 쿠키로 설정 (Refresh Token은 서버 DB에만 저장)
        // 쿠키 만료시간은 Refresh Token과 동일하게 설정하여 자동 갱신 가능하도록 함

        ResponseCookie accessTokenCookie = ResponseCookie.from("accessToken", tokenMap.get("accessToken"))
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/")
                .maxAge(Duration.ofMinutes(refreshTokenMin))
                .sameSite(cookieSameSite)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessTokenCookie.toString());
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

    private ResponseEntity<Map<String, String>> handleException(String msg, int status) {
        return ResponseEntity.status(status).body(Map.of("error", msg));
    }
}
