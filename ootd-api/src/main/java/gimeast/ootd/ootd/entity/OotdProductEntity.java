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
@Table(name = "ootd_product")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OotdProductEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ootd_id", nullable = false)
    private OotdEntity ootdEntity;

    @Column(nullable = false, length = 200)
    private String productName;

    @Column(length = 500)
    private String productLink;

    @Column(length = 500)
    private String ogImage;

    @Column(nullable = false)
    private Integer displayOrder;

    public void changeDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public void changeProductInfo(String productName, String productLink) {
        this.productName = productName;
        this.productLink = productLink;
    }

    public void changeOgImage(String ogImage) {
        this.ogImage = ogImage;
    }
}