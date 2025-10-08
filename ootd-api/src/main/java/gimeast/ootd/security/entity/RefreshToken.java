package gimeast.ootd.security.entity;

import gimeast.ootd.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RefreshToken extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String refreshToken;

    @Column(nullable = false, unique = true)
    private Long memberIdx;

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    @Builder
    public RefreshToken(String refreshToken, Long memberIdx, LocalDateTime expiryDate) {
        this.refreshToken = refreshToken;
        this.memberIdx = memberIdx;
        this.expiryDate = expiryDate;
    }

    public void updateToken(String refreshToken, LocalDateTime expiryDate) {
        this.refreshToken = refreshToken;
        this.expiryDate = expiryDate;
    }

}
