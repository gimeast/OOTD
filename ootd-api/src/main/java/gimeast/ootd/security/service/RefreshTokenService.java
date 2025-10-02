package gimeast.ootd.security.service;

import gimeast.ootd.member.dto.MemberDTO;
import gimeast.ootd.member.service.MemberService;
import gimeast.ootd.security.entity.RefreshToken;
import gimeast.ootd.security.repository.RefreshTokenRepository;
import gimeast.ootd.security.util.JWTUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Log4j2
public class RefreshTokenService {

    @Value("${jwt.access-token.min}")
    private int jwtAccessTokenMin;

    @Value("${jwt.refresh-token.min}")
    private int jwtRefreshTokenMin;

    private final JWTUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;
    private final MemberService memberService;

    /**
     * 리프레시 토큰 생성 및 저장
     * @param memberDTOResult
     * @return
     */
    @Transactional
    public Map<String, String> makeTokenMap(MemberDTO memberDTOResult) {
        String email = memberDTOResult.getEmail();
        Map<String, Object> dataMap = memberDTOResult.getDataMap();
        String accessToken = jwtUtil.createToken(dataMap, jwtAccessTokenMin);
        String refreshToken = jwtUtil.createToken(Map.of("email", email), jwtRefreshTokenMin);

        log.info("accessToken: {}", accessToken);
        log.info("refreshToken: {}", refreshToken);

        refreshTokenRepository.findByEmail(email)
                .ifPresentOrElse(
                        token -> token.updateToken(refreshToken, LocalDateTime.now().plusMinutes(jwtRefreshTokenMin)),
                        () -> refreshTokenRepository.save(
                                RefreshToken.builder()
                                        .refreshToken(refreshToken)
                                        .email(email)
                                        .expiryDate(LocalDateTime.now().plusMinutes(jwtRefreshTokenMin))
                                        .build()
                        )
                );

        return Map.of("accessToken", accessToken, "refreshToken", refreshToken);
    }

    /**
     * DB에 저장된 Refresh Token을 이용해 새로운 Access Token 발급
     * @param email
     * @return
     */
    @Transactional
    public Map<String, String> refreshAccessToken(String email) {
        // DB에서 Refresh Token 조회
        RefreshToken refreshToken = refreshTokenRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Refresh Token not found"));

        // Refresh Token 만료 확인
        if (refreshToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Refresh Token expired");
        }

        // DB의 Refresh Token 검증
        try {
            jwtUtil.validateToken(refreshToken.getRefreshToken());
        } catch (Exception e) {
            throw new RuntimeException("Invalid Refresh Token");
        }

        // 새로운 Access Token 생성
        MemberDTO memberDTO = memberService.getByEmail(email);
        Map<String, Object> dataMap = memberDTO.getDataMap();
        String newAccessToken = jwtUtil.createToken(dataMap, jwtAccessTokenMin);

        log.info("New accessToken created for email: {}", email);

        return Map.of("accessToken", newAccessToken);
    }

}
