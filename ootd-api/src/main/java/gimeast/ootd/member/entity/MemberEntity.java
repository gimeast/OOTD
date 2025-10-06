package gimeast.ootd.member.entity;

import gimeast.ootd.common.entity.BaseEntity;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="member")
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MemberEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idx;

    private String password;

    private String name;

    @Column(unique = true, nullable = false)
    private String nickname;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(length = 500)
    private String profileImageUrl;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private MemberStatus status = MemberStatus.ACTIVE;

    @Column(nullable = false)
    @Builder.Default
    private Boolean allAgreed = false;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
            name = "member_roles",
            joinColumns = @JoinColumn(name = "member_idx")  // 조인 컬럼 이름 지정 (선택사항)
    )
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Set<MemberRole> roleSet = new HashSet<>();

    public void changePassword(String password) {
        this.password = password;
    }

    public void changeName(String name) {
        this.name = name;
    }

    public void changeEmail(String email) {
        this.email = email;
    }

    public void changeStatus(MemberStatus status) {
        this.status = status;
    }

    public void changeProfileImage(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

}
