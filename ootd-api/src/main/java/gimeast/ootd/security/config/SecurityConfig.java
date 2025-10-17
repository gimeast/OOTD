package gimeast.ootd.security.config;

import gimeast.ootd.security.filter.JWTCheckFilter;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@Log4j2
@EnableMethodSecurity //컨트롤러에 직접 설정하는 어노테이션 방식 사용
@RequiredArgsConstructor
public class SecurityConfig {
    @Value("${cors.allowed-origins}")
    private String allowedOrigins;

    private final JWTCheckFilter jwtCheckFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        log.info("filter chain..........");

        //토큰을 이용하는 API 서버는 로그인,로그아웃 페이지를 제공하지 않도록 구성
        httpSecurity.formLogin(AbstractHttpConfigurer::disable);
        httpSecurity.logout(AbstractHttpConfigurer::disable);
        //CSRF토큰은 GET 방식을 제외한 모든 요청에 CSRF토큰을 포함시키는 설정이며 기본적으로 세션단위로 관리되는데 API 서버는 상태 유지를 하지 않기 때문에 사용하지 않도록 설정
        httpSecurity.csrf(AbstractHttpConfigurer::disable);
        //API 서버는 세션을 생성하지 않도록 구성하는 부분
        httpSecurity.sessionManagement(sessionManagementConfigurer -> sessionManagementConfigurer.sessionCreationPolicy(SessionCreationPolicy.NEVER));
        //jwtCheckFilter를 UsernamePasswordAuthenticationFilter 앞에 두기
        httpSecurity.addFilterBefore(jwtCheckFilter, UsernamePasswordAuthenticationFilter.class);
        httpSecurity.cors(cors-> cors.configurationSource(corsConfigurationSource()));
        return httpSecurity.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        log.info("CORS 설정 - allowedOrigins: {}", allowedOrigins);

        CorsConfiguration corsConfiguration = new CorsConfiguration();
        // 콤마로 구분된 문자열을 List로 변환
        List<String> origins = List.of(allowedOrigins.split(","));
        corsConfiguration.setAllowedOrigins(origins); //접근 허락 할 주소
        corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PATCH", "PUT", "DELETE", "HEAD", "OPTIONS"));
        corsConfiguration.setAllowedHeaders(List.of("*")); // 모든 헤더 허용
        corsConfiguration.setAllowCredentials(true); // 쿠키를 포함한 요청 허용
        corsConfiguration.setExposedHeaders(List.of("Set-Cookie", "Authorization")); // Set-Cookie 헤더 노출

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);
        return source;
    }
}
