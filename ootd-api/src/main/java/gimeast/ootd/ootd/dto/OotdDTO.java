package gimeast.ootd.ootd.dto;

import gimeast.ootd.member.dto.MemberDTO;
import gimeast.ootd.ootd.entity.OotdEntity;
import gimeast.ootd.ootd.entity.OotdStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class OotdDTO {
    private Long id;
    private MemberDTO member;
    private String content;
    private Integer likeCount;
    private Integer bookmarkCount;
    private OotdStatus status;
    private List<OotdImageDTO> images;
    private List<String> hashtags;
    private List<OotdProductDTO> products;
    private LocalDateTime regDate;
    private LocalDateTime modDate;

    public OotdDTO(OotdEntity entity) {
        this.id = entity.getId();
        this.member = new MemberDTO(entity.getMember());
        this.content = entity.getContent();
        this.likeCount = entity.getLikeCount();
        this.bookmarkCount = entity.getBookmarkCount();
        this.status = entity.getStatus();
        this.images = entity.getImages().stream()
                .map(OotdImageDTO::new)
                .collect(Collectors.toList());
        this.hashtags = entity.getHashtags().stream()
                .map(h -> h.getHashtagEntity().getTagName())
                .collect(Collectors.toList());
        this.products = entity.getProducts().stream()
                .map(OotdProductDTO::new)
                .collect(Collectors.toList());
        this.regDate = entity.getRegDate();
        this.modDate = entity.getModDate();
    }
}