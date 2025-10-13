package gimeast.ootd.common.util;

import lombok.extern.log4j.Log4j2;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Log4j2
public class OgImageExtractor {

    private static final int TIMEOUT = 10000; // 10 seconds timeout
    private static final String USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

    /**
     * URL에서 og:image 메타 태그를 추출합니다.
     * @param url 추출할 URL
     * @return og:image URL, 없으면 null
     */
    public String extractOgImage(String url) {
        if (url == null || url.trim().isEmpty()) {
            return null;
        }

        try {
            Document doc = Jsoup.connect(url)
                    .timeout(TIMEOUT)
                    .userAgent(USER_AGENT)
                    .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8")
                    .header("Accept-Language", "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7")
                    .header("Accept-Encoding", "gzip, deflate, br")
                    .header("Connection", "keep-alive")
                    .header("Upgrade-Insecure-Requests", "1")
                    .header("Sec-Fetch-Dest", "document")
                    .header("Sec-Fetch-Mode", "navigate")
                    .header("Sec-Fetch-Site", "none")
                    .header("Cache-Control", "max-age=0")
                    .referrer("https://www.google.com")
                    .followRedirects(true)
                    .ignoreHttpErrors(true)
                    .get();

            // og:image 메타 태그 찾기
            Element ogImageElement = doc.selectFirst("meta[property=og:image]");
            if (ogImageElement != null) {
                String ogImageUrl = ogImageElement.attr("content");
                if (ogImageUrl != null && !ogImageUrl.trim().isEmpty()) {
                    log.info("Successfully extracted og:image from {}: {}", url, ogImageUrl);
                    return ogImageUrl;
                }
            }

            // og:image가 없으면 twitter:image 시도
            Element twitterImageElement = doc.selectFirst("meta[name=twitter:image]");
            if (twitterImageElement != null) {
                String twitterImageUrl = twitterImageElement.attr("content");
                if (twitterImageUrl != null && !twitterImageUrl.trim().isEmpty()) {
                    log.info("Successfully extracted twitter:image from {}: {}", url, twitterImageUrl);
                    return twitterImageUrl;
                }
            }

            log.warn("No og:image or twitter:image found for URL: {}", url);
            return null;

        } catch (IOException e) {
            log.error("Failed to extract og:image from URL: {}", url, e);
            return null;
        } catch (Exception e) {
            log.error("Unexpected error while extracting og:image from URL: {}", url, e);
            return null;
        }
    }
}