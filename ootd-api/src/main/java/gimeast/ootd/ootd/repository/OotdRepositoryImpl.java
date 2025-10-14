package gimeast.ootd.ootd.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.JPQLQuery;
import gimeast.ootd.ootd.dto.OotdListResponseDTO;
import gimeast.ootd.ootd.dto.ProductDTO;
import gimeast.ootd.ootd.entity.OotdStatus;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

import java.util.List;
import java.util.stream.Collectors;

import static gimeast.ootd.ootd.entity.QOotdEntity.ootdEntity;
import static gimeast.ootd.ootd.entity.QOotdImageEntity.ootdImageEntity;
import static gimeast.ootd.ootd.entity.QOotdLikeEntity.ootdLikeEntity;
import static gimeast.ootd.ootd.entity.QOotdBookmarkEntity.ootdBookmarkEntity;
import static gimeast.ootd.ootd.entity.QOotdHashtagEntity.ootdHashtagEntity;
import static gimeast.ootd.ootd.entity.QOotdProductEntity.ootdProductEntity;
import static gimeast.ootd.member.entity.QMemberEntity.memberEntity;
import static gimeast.ootd.hashtag.entity.QHashtagEntity.hashtagEntity;

@Log4j2
public class OotdRepositoryImpl extends QuerydslRepositorySupport implements OotdRepositoryCustom {

    public OotdRepositoryImpl() {
        super(gimeast.ootd.ootd.entity.OotdEntity.class);
    }

    @Override
    public Page<OotdListResponseDTO> findOotdList(Long currentMemberIdx, Pageable pageable) {
        JPQLQuery<gimeast.ootd.ootd.entity.OotdEntity> query = from(ootdEntity)
                .leftJoin(ootdEntity.member, memberEntity).fetchJoin()
                .leftJoin(ootdEntity.images, ootdImageEntity)
                .leftJoin(ootdEntity.hashtags, ootdHashtagEntity)
                .leftJoin(ootdHashtagEntity.hashtagEntity, hashtagEntity)
                .leftJoin(ootdEntity.products, ootdProductEntity)
                .where(ootdEntity.status.eq(OotdStatus.ACTIVE))
                .distinct();

        // 페이징 적용
        JPQLQuery<gimeast.ootd.ootd.entity.OotdEntity> pagedQuery = getQuerydsl().applyPagination(pageable, query);

        // 전체 개수 조회
        long total = query.fetchCount();

        // 결과 조회
        List<gimeast.ootd.ootd.entity.OotdEntity> ootdEntities = pagedQuery.fetch();

        // 현재 사용자의 좋아요 정보 일괄 조회
        List<Long> likedOotdIds = List.of();
        if (currentMemberIdx != null && !ootdEntities.isEmpty()) {
            List<Long> ootdIds = ootdEntities.stream().map(gimeast.ootd.ootd.entity.OotdEntity::getId).toList();
            log.info("Fetching likes for currentMemberIdx: {}, ootdIds: {}", currentMemberIdx, ootdIds);

            likedOotdIds = from(ootdLikeEntity)
                    .where(ootdLikeEntity.ootdEntity.id.in(ootdIds)
                            .and(ootdLikeEntity.member.idx.eq(currentMemberIdx)))
                    .select(ootdLikeEntity.ootdEntity.id)
                    .fetch();

            log.info("Found liked OOTD IDs: {}", likedOotdIds);
        } else {
            log.info("Skipping like fetch - currentMemberIdx: {}, ootdEntities.isEmpty(): {}",
                    currentMemberIdx, ootdEntities.isEmpty());
        }
        final List<Long> finalLikedOotdIds = likedOotdIds;

        // 현재 사용자의 북마크 정보 일괄 조회
        List<Long> bookmarkedOotdIds = List.of();
        if (currentMemberIdx != null && !ootdEntities.isEmpty()) {
            bookmarkedOotdIds = from(ootdBookmarkEntity)
                    .where(ootdBookmarkEntity.ootdEntity.id.in(
                            ootdEntities.stream().map(gimeast.ootd.ootd.entity.OotdEntity::getId).toList()
                    ).and(ootdBookmarkEntity.member.idx.eq(currentMemberIdx)))
                    .select(ootdBookmarkEntity.ootdEntity.id)
                    .fetch();
        }
        final List<Long> finalBookmarkedOotdIds = bookmarkedOotdIds;

        // DTO 변환
        List<OotdListResponseDTO> dtoList = ootdEntities.stream()
                .map(entity -> {
                    // 이미지 리스트 조회
                    List<String> images = entity.getImages().stream()
                            .sorted((img1, img2) -> img1.getImageOrder().compareTo(img2.getImageOrder()))
                            .map(gimeast.ootd.ootd.entity.OotdImageEntity::getImageUrl)
                            .collect(Collectors.toList());

                    // 해시태그 리스트 조회
                    List<String> hashtags = entity.getHashtags().stream()
                            .map(h -> h.getHashtagEntity().getTagName())
                            .collect(Collectors.toList());

                    // 제품 리스트 조회
                    List<ProductDTO> products = entity.getProducts().stream()
                            .sorted((p1, p2) -> p1.getDisplayOrder().compareTo(p2.getDisplayOrder()))
                            .map(product -> ProductDTO.builder()
                                    .productName(product.getProductName())
                                    .productLink(product.getProductLink())
                                    .ogImage(product.getOgImage())
                                    .build())
                            .collect(Collectors.toList());

                    // 좋아요 여부 확인 (일괄 조회한 데이터에서 확인)
                    Boolean isLiked = finalLikedOotdIds.contains(entity.getId());

                    // 북마크 여부 확인 (일괄 조회한 데이터에서 확인)
                    Boolean isBookmarked = finalBookmarkedOotdIds.contains(entity.getId());

                    return OotdListResponseDTO.builder()
                            .ootdId(entity.getId())
                            .profileImageUrl(entity.getMember().getProfileImageUrl())
                            .nickname(entity.getMember().getNickname())
                            .ootdImages(images)
                            .isLiked(isLiked)
                            .likeCount(entity.getLikeCount())
                            .isBookmarked(isBookmarked)
                            .content(entity.getContent())
                            .hashtags(hashtags)
                            .products(products)
                            .build();
                })
                .collect(Collectors.toList());

        return new PageImpl<>(dtoList, pageable, total);
    }
}