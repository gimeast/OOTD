package gimeast.ootd.member.dto;

import gimeast.ootd.member.entity.MemberEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MemberSearchDTO {
    private Long idx;
    private String nickname;
    private String profileImageUrl;
    private String bio;

    public MemberSearchDTO(MemberEntity memberEntity) {
        this.idx = memberEntity.getIdx();
        this.nickname = memberEntity.getNickname();
        this.profileImageUrl = memberEntity.getProfileImageUrl();
        this.bio = memberEntity.getBio();
    }
}