package gimeast.ootd.ootd.dto;

import gimeast.ootd.ootd.entity.OotdImageEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class OotdImageDTO {
    private Long id;
    private String imageUrl;
    private Integer imageOrder;
    private String originalFilename;
    private Long fileSize;
    private LocalDateTime regDate;

    public OotdImageDTO(OotdImageEntity entity) {
        this.id = entity.getId();
        this.imageUrl = entity.getImageUrl();
        this.imageOrder = entity.getImageOrder();
        this.originalFilename = entity.getOriginalFilename();
        this.fileSize = entity.getFileSize();
        this.regDate = entity.getRegDate();
    }
}
