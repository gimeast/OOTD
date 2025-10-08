package gimeast.ootd.ootd.entity;

import gimeast.ootd.common.entity.BaseEntity;
import gimeast.ootd.member.entity.MemberEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ootd")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OotdEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_idx", nullable = false)
    private MemberEntity member;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Builder.Default
    @Column(nullable = false)
    private Integer likeCount = 0;

    @Builder.Default
    @Column(nullable = false)
    private Integer bookmarkCount = 0;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false, length = 20)
    private OotdStatus status = OotdStatus.ACTIVE;

    @Builder.Default
    @OneToMany(mappedBy = "ootdEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OotdImageEntity> images = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "ootdEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OotdHashtagEntity> hashtags = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "ootdEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OotdProductEntity> products = new ArrayList<>();

    public void changeContent(String content) {
        this.content = content;
    }

    public void incrementLikeCount() {
        this.likeCount++;
    }

    public void decrementLikeCount() {
        if (this.likeCount > 0) {
            this.likeCount--;
        }
    }

    public void incrementBookmarkCount() {
        this.bookmarkCount++;
    }

    public void decrementBookmarkCount() {
        if (this.bookmarkCount > 0) {
            this.bookmarkCount--;
        }
    }

    public void delete() {
        this.status = OotdStatus.DELETED;
    }

    public void addImage(OotdImageEntity image) {
        this.images.add(image);
    }

    public void addHashtag(OotdHashtagEntity hashtag) {
        this.hashtags.add(hashtag);
    }

    public void addProduct(OotdProductEntity product) {
        this.products.add(product);
    }
}