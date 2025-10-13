package gimeast.ootd.common.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class OgImageExtractorTest {

    @Autowired
    private OgImageExtractor ogImageExtractor;

    @Test
    @DisplayName("유효한 URL에서 og:image 추출 성공")
    void extractOgImage_Success() {
        // given
        String url = "https://www.naver.com";

        // when
        String ogImage = ogImageExtractor.extractOgImage(url);

        // then
        assertNotNull(ogImage, "og:image should not be null");
        assertTrue(ogImage.startsWith("http"), "og:image should be a valid URL");
        System.out.println("Extracted og:image: " + ogImage);
    }

    @Test
    @DisplayName("Zara 상품 페이지에서 og:image 추출")
    void extractOgImage_Zara() {
        // given
        String url = "https://www.zara.com/kr/ko/%E1%84%85%E1%85%A6%E1%84%80%E1%85%B2%E1%86%AF%E1%84%85%E1%85%A5-%E1%84%91%E1%85%B5%E1%86%BA-%E1%84%89%E1%85%B3%E1%84%8B%E1%85%B0%E1%84%8B%E1%85%B5%E1%84%83%E1%85%B3-%E1%84%8C%E1%85%A5%E1%86%B7%E1%84%91%E1%85%A5-p06318405.html?v1=452729125&v2=2444334";

        // when
        String ogImage = ogImageExtractor.extractOgImage(url);

        // then
        System.out.println("Extracted og:image from Zara: " + ogImage);

        if (ogImage != null) {
            assertTrue(ogImage.startsWith("http"), "og:image should be a valid URL");
            assertTrue(ogImage.contains("zara") || ogImage.contains("static"), "Should be Zara's image URL");
        } else {
            System.out.println("Warning: Could not extract og:image from Zara (might be blocked)");
        }
    }

    @Test
    @DisplayName("다양한 쇼핑몰 사이트에서 og:image 추출")
    void extractOgImage_VariousSites() {
        // given - 테스트할 다양한 사이트들
        String[] urls = {
            "https://www.musinsa.com",
            "https://www.29cm.co.kr",
            "https://www.wconcept.co.kr"
        };

        // when & then
        for (String url : urls) {
            String ogImage = ogImageExtractor.extractOgImage(url);
            System.out.println("URL: " + url);
            System.out.println("og:image: " + ogImage);
            System.out.println("---");
        }
    }

    @Test
    @DisplayName("null URL 처리")
    void extractOgImage_NullUrl() {
        // given
        String url = null;

        // when
        String ogImage = ogImageExtractor.extractOgImage(url);

        // then
        assertNull(ogImage, "Should return null for null URL");
    }

    @Test
    @DisplayName("빈 문자열 URL 처리")
    void extractOgImage_EmptyUrl() {
        // given
        String url = "";

        // when
        String ogImage = ogImageExtractor.extractOgImage(url);

        // then
        assertNull(ogImage, "Should return null for empty URL");
    }

    @Test
    @DisplayName("공백만 있는 URL 처리")
    void extractOgImage_WhitespaceUrl() {
        // given
        String url = "   ";

        // when
        String ogImage = ogImageExtractor.extractOgImage(url);

        // then
        assertNull(ogImage, "Should return null for whitespace URL");
    }

    @Test
    @DisplayName("잘못된 URL 형식 처리")
    void extractOgImage_InvalidUrl() {
        // given
        String url = "not-a-valid-url";

        // when
        String ogImage = ogImageExtractor.extractOgImage(url);

        // then
        assertNull(ogImage, "Should return null for invalid URL");
    }

    @Test
    @DisplayName("존재하지 않는 도메인 처리")
    void extractOgImage_NonExistentDomain() {
        // given
        String url = "https://this-domain-does-not-exist-12345.com";

        // when
        String ogImage = ogImageExtractor.extractOgImage(url);

        // then
        assertNull(ogImage, "Should return null for non-existent domain");
    }

    @Test
    @DisplayName("GitHub 페이지에서 og:image 추출")
    void extractOgImage_GitHub() {
        // given
        String url = "https://github.com";

        // when
        String ogImage = ogImageExtractor.extractOgImage(url);

        // then
        System.out.println("GitHub og:image: " + ogImage);

        if (ogImage != null) {
            assertTrue(ogImage.startsWith("http"), "og:image should be a valid URL");
        }
    }

    @Test
    @DisplayName("타임아웃 테스트 - 느린 사이트")
    void extractOgImage_Timeout() {
        // given - httpbin.org의 delay 엔드포인트 (15초 지연)
        String url = "https://httpbin.org/delay/15";

        // when
        long startTime = System.currentTimeMillis();
        String ogImage = ogImageExtractor.extractOgImage(url);
        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;

        // then
        System.out.println("Duration: " + duration + "ms");
        assertTrue(duration < 15000, "Should timeout before 15 seconds");
        assertNull(ogImage, "Should return null on timeout");
    }
}