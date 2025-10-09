package gimeast.ootd.ootd.entity;

import gimeast.ootd.common.entity.BaseEntity;
import gimeast.ootd.hashtag.entity.HashtagEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ootd_hashtag")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OotdHashtagEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ootd_id", nullable = false)
    private OotdEntity ootdEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hashtag_id", nullable = false)
    private HashtagEntity hashtagEntity;
}