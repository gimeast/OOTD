package gimeast.ootd.upload.service;

import lombok.extern.log4j.Log4j2;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Log4j2
public class FileUploadService {

    @Value("${files.upload.path}")
    private String uploadPath;

    // 최적화 설정
    private static final int MAX_WIDTH = 1920;  // 최대 가로 크기
    private static final int MAX_HEIGHT = 1920; // 최대 세로 크기
    private static final float QUALITY = 0.85f; // 이미지 품질 (0.0 ~ 1.0)
    private static final int THUMBNAIL_SIZE = 200; // 썸네일 크기
    private static final String OUTPUT_FORMAT = "webp"; // 출력 포맷

    public List<ImageUploadResult> uploadImages(MultipartFile[] files) throws IOException {
        List<ImageUploadResult> results = new ArrayList<>();

        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                continue;
            }

            String originalFilename = file.getOriginalFilename();
            String uuid = UUID.randomUUID().toString();
            String contentType = file.getContentType();

            // 날짜별 폴더 생성
            String folderPath = makeFolder();

            // 확장자 추출 및 변환 (WebP로 통일)
            String extension = getFileExtension(originalFilename);
            String optimizedExtension = shouldConvertToWebP(contentType) ? OUTPUT_FORMAT : extension;
            String optimizedFilename = uuid + "_" + removeExtension(originalFilename) + "." + optimizedExtension;

            String saveName = uploadPath + File.separator + folderPath + File.separator + optimizedFilename;
            File saveFile = new File(saveName);

            // 이미지 파일인 경우 최적화하여 저장
            if (contentType != null && contentType.startsWith("image")) {
                try {
                    // 원본 이미지를 최적화하여 저장
                    Thumbnails.Builder<?> builder = Thumbnails.of(file.getInputStream())
                            .size(MAX_WIDTH, MAX_HEIGHT)
                            .outputQuality(QUALITY)
                            .keepAspectRatio(true);

                    // WebP로 변환
                    if (shouldConvertToWebP(contentType)) {
                        builder.outputFormat(OUTPUT_FORMAT);
                    }

                    builder.toFile(saveFile);

                    log.info("이미지 최적화 완료: {} -> {} bytes ({})", originalFilename, saveFile.length(), optimizedExtension);

                    // 썸네일 생성
                    String thumbnailSaveName = uploadPath + File.separator + folderPath + File.separator
                            + "s_" + optimizedFilename;
                    File thumbnailFile = new File(thumbnailSaveName);

                    Thumbnails.of(saveFile)
                            .size(THUMBNAIL_SIZE, THUMBNAIL_SIZE)
                            .outputQuality(QUALITY)
                            .outputFormat(OUTPUT_FORMAT)
                            .toFile(thumbnailFile);

                } catch (IOException e) {
                    log.error("이미지 최적화 실패: " + e.getMessage());
                    // 최적화 실패 시 원본 저장
                    file.transferTo(saveFile.toPath());
                }
            } else {
                // 이미지가 아닌 경우 원본 그대로 저장
                file.transferTo(saveFile.toPath());
            }

            // 이미지 URL 생성 (상대 경로)
            String imageUrl = "/" + folderPath.replace(File.separator, "/") + "/" + optimizedFilename;

            ImageUploadResult result = ImageUploadResult.builder()
                    .imageUrl(imageUrl)
                    .originalFilename(originalFilename)
                    .fileSize(saveFile.length()) // 최적화 후 파일 크기
                    .build();

            results.add(result);
        }

        return results;
    }

    private boolean shouldConvertToWebP(String contentType) {
        // 모든 이미지를 WebP로 변환 (WebP는 투명도와 애니메이션 모두 지원)
        return contentType != null && contentType.startsWith("image");
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return OUTPUT_FORMAT;
        }
        return filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
    }

    private String removeExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return filename;
        }
        return filename.substring(0, filename.lastIndexOf("."));
    }

    private String makeFolder() {
        String str = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
        String folderPath = str.replace("/", File.separator);

        File uploadPathFolder = new File(uploadPath, folderPath);

        if (!uploadPathFolder.exists()) {
            uploadPathFolder.mkdirs();
        }

        return folderPath;
    }

    public void deleteFile(String fileName) {
        try {
            // 원본 파일 삭제
            Path filePath = Paths.get(uploadPath + File.separator + fileName.replace("/", File.separator));
            boolean deleted = Files.deleteIfExists(filePath);

            if (deleted) {
                log.info("파일 삭제 완료: {}", fileName);
            }

            // 썸네일도 삭제
            String thumbnailFileName = fileName.substring(0, fileName.lastIndexOf("/") + 1)
                    + "s_" + fileName.substring(fileName.lastIndexOf("/") + 1);
            Path thumbnailPath = Paths.get(uploadPath + File.separator + thumbnailFileName.replace("/", File.separator));
            boolean thumbnailDeleted = Files.deleteIfExists(thumbnailPath);

            if (thumbnailDeleted) {
                log.info("썸네일 삭제 완료: {}", thumbnailFileName);
            }
        } catch (IOException e) {
            log.error("파일 삭제 실패: " + e.getMessage());
        }
    }
}