package gimeast.ootd.ootd.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OotdResponseDTO {
    private Long ootdId;
    private String profileImageUrl;
    private String nickname;
    private List<String> ootdImages;  // 전체 목록 조회 시 사용
    private String ootdImage;  // my/liked/bookmarked 조회 시 사용 (단건)
    private Boolean isLiked;
    private Integer likeCount;
    private Boolean isBookmarked;
    private String content;
    private List<String> hashtags;
    private List<ProductDTO> products;
}