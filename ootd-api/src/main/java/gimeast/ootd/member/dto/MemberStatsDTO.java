package gimeast.ootd.member.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MemberStatsDTO {
    private Long postCount;      // 게시물 수
    private Long followerCount;  // 팔로워 수 (추후 구현)
    private Long followingCount; // 팔로잉 수 (추후 구현)
}