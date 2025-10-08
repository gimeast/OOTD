package gimeast.ootd.upload.controller;

import gimeast.ootd.upload.service.FileUploadService;
import gimeast.ootd.upload.service.ImageUploadResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/upload")
@Log4j2
public class UploadController {

    private final FileUploadService fileUploadService;

    @PostMapping("/images")
    public ResponseEntity<List<ImageUploadResult>> uploadImages(
            @RequestParam("images") MultipartFile[] files) {
        try {
            log.info("이미지 업로드 요청: {} 개 파일", files.length);
            List<ImageUploadResult> results = fileUploadService.uploadImages(files);
            return ResponseEntity.ok(results);
        } catch (IOException e) {
            log.error("이미지 업로드 실패: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/images")
    public ResponseEntity<Void> deleteImage(@RequestParam("fileName") String fileName) {
        try {
            log.info("이미지 삭제 요청: {}", fileName);
            fileUploadService.deleteFile(fileName);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("이미지 삭제 실패: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}