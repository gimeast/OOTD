package gimeast.ootd.upload.service;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ImageUploadResult {
    private String imageUrl;
    private String originalFilename;
    private Long fileSize;
}