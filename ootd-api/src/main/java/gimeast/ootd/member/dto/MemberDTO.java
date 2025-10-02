package gimeast.ootd.member.dto;

import gimeast.ootd.member.entity.MemberEntity;
import gimeast.ootd.member.entity.MemberRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class MemberDTO {
    private Long idx;
    private String mpw;
    private String name;
    private String nickname;
    private String email;
    private LocalDateTime regDate;
    private LocalDateTime modDate;
    private Set<MemberRole> roleSet;

    public Map<String, Object> getDataMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("idx", idx);
        map.put("email", email);
        map.put("name", name);
        map.put("roleSet", roleSet);
        return map;
    }

    public MemberDTO(MemberEntity memberEntity) {
        this.idx = memberEntity.getIdx();
        this.mpw = memberEntity.getMpw();
        this.name = memberEntity.getName();
        this.nickname = memberEntity.getNickname();
        this.email = memberEntity.getEmail();
        this.regDate = memberEntity.getRegDate();
        this.modDate = memberEntity.getModDate();
        this.roleSet = memberEntity.getRoleSet();
    }
}
