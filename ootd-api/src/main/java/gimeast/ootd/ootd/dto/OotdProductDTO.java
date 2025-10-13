package gimeast.ootd.ootd.dto;

import gimeast.ootd.ootd.entity.OotdProductEntity;
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
public class OotdProductDTO {
    private Long id;
    private String productName;
    private String productLink;
    private String ogImage;
    private Integer displayOrder;
    private LocalDateTime regDate;

    public OotdProductDTO(OotdProductEntity entity) {
        this.id = entity.getId();
        this.productName = entity.getProductName();
        this.productLink = entity.getProductLink();
        this.ogImage = entity.getOgImage();
        this.displayOrder = entity.getDisplayOrder();
        this.regDate = entity.getRegDate();
    }
}