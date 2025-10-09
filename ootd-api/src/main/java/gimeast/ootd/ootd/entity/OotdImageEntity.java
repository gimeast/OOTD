package gimeast.ootd.ootd.entity;

import gimeast.ootd.common.entity.BaseEntity;
import jakarta.persistence.Column;
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
@Table(name = "ootd_image")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OotdImageEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ootd_id", nullable = false)
    private OotdEntity ootdEntity;

    @Column(nullable = false, length = 500)
    private String imageUrl;

    @Column(nullable = false)
    private Integer imageOrder;

    @Column(length = 255)
    private String originalFilename;

    private Long fileSize;

    public void changeImageOrder(Integer imageOrder) {
        this.imageOrder = imageOrder;
    }
}