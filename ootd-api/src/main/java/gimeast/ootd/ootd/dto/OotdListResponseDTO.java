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
public class OotdListResponseDTO {
    private Long ootdId;
    private String profileImageUrl;
    private String nickname;
    private List<String> ootdImages;
    private Boolean isLiked;
    private Integer likeCount;
    private Boolean isBookmarked;
    private String content;
    private List<String> hashtags;
    private List<ProductDTO> products;
}