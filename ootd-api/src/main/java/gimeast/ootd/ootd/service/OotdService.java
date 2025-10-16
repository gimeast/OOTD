package gimeast.ootd.ootd.service;

import gimeast.ootd.common.dto.PageRequestDTO;
import gimeast.ootd.common.util.OgImageExtractor;
import gimeast.ootd.hashtag.entity.HashtagEntity;
import gimeast.ootd.hashtag.repository.HashtagRepository;
import gimeast.ootd.member.entity.MemberEntity;
import gimeast.ootd.member.repository.MemberRepository;
import gimeast.ootd.ootd.dto.OotdDTO;
import gimeast.ootd.ootd.dto.OotdListResponseDTO;
import gimeast.ootd.ootd.entity.OotdEntity;
import gimeast.ootd.ootd.entity.OotdHashtagEntity;
import gimeast.ootd.ootd.entity.OotdImageEntity;
import gimeast.ootd.ootd.entity.OotdProductEntity;
import gimeast.ootd.ootd.repository.OotdRepository;
import gimeast.ootd.upload.service.FileUploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class OotdService {
    private final OotdRepository ootdRepository;
    private final MemberRepository memberRepository;
    private final HashtagRepository hashtagRepository;
    private final OgImageExtractor ogImageExtractor;
    private final FileUploadService fileUploadService;

    @Transactional
    public OotdDTO saveOotd(OotdDTO ootdDTO, Long memberIdx) {
        // Member 조회 (토큰에서 받은 idx 사용)
        MemberEntity member = memberRepository.findById(memberIdx)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        // OotdEntity 생성
        OotdEntity ootdEntity = OotdEntity.builder()
                .member(member)
                .content(ootdDTO.getContent())
                .build();

        // 이미지 추가
        if (ootdDTO.getImages() != null && !ootdDTO.getImages().isEmpty()) {
            List<OotdImageEntity> images = ootdDTO.getImages().stream()
                    .map(imageDTO -> OotdImageEntity.builder()
                            .ootdEntity(ootdEntity)
                            .imageUrl(imageDTO.getImageUrl())
                            .imageOrder(imageDTO.getImageOrder())
                            .originalFilename(imageDTO.getOriginalFilename())
                            .fileSize(imageDTO.getFileSize())
                            .build())
                    .toList();

            images.forEach(ootdEntity::addImage);
        }

        // 해시태그 추가
        if (ootdDTO.getHashtags() != null && !ootdDTO.getHashtags().isEmpty()) {
            List<OotdHashtagEntity> hashtags = ootdDTO.getHashtags().stream()
                    .map(tagName -> {
                        // 기존 해시태그 조회 또는 생성
                        HashtagEntity hashtagEntity = hashtagRepository.findByTagName(tagName)
                                .orElseGet(() -> {
                                    HashtagEntity newHashtagEntity = HashtagEntity.builder()
                                            .tagName(tagName)
                                            .build();
                                    return hashtagRepository.save(newHashtagEntity);
                                });

                        hashtagEntity.incrementUsageCount();

                        return OotdHashtagEntity.builder()
                                .ootdEntity(ootdEntity)
                                .hashtagEntity(hashtagEntity)
                                .build();
                    })
                    .toList();

            hashtags.forEach(ootdEntity::addHashtag);
        }

        // 착용 상품 추가
        if (ootdDTO.getProducts() != null && !ootdDTO.getProducts().isEmpty()) {
            List<OotdProductEntity> products = ootdDTO.getProducts().stream()
                    .map(productDTO -> {
                        // 상품 링크가 있으면 og:image 추출
                        String ogImage = null;
                        if (productDTO.getProductLink() != null && !productDTO.getProductLink().trim().isEmpty()) {
                            ogImage = ogImageExtractor.extractOgImage(productDTO.getProductLink());
                        }

                        return OotdProductEntity.builder()
                                .ootdEntity(ootdEntity)
                                .productName(productDTO.getProductName())
                                .productLink(productDTO.getProductLink())
                                .ogImage(ogImage)
                                .displayOrder(productDTO.getDisplayOrder())
                                .build();
                    })
                    .toList();

            products.forEach(ootdEntity::addProduct);
        }

        // 저장
        OotdEntity savedEntity = ootdRepository.save(ootdEntity);

        return new OotdDTO(savedEntity);
    }

    @Transactional(readOnly = true)
    public Page<OotdListResponseDTO> getOotdList(PageRequestDTO pageRequestDTO, Long currentMemberIdx) {
        Sort sort;

        // sort 파라미터에 따라 정렬 조건 설정
        if ("like".equals(pageRequestDTO.getSort())) {
            // 인기순: 좋아요 많은순(likeCount), 같으면 최신순(id)
            sort = Sort.by(
                Sort.Order.desc("likeCount"),
                Sort.Order.desc("id")
            );
        } else {
            // 최신순 (기본값)
            sort = Sort.by(Sort.Direction.DESC, "id");
        }

        Pageable pageable = pageRequestDTO.getPageable(sort);
        return ootdRepository.findOotdList(currentMemberIdx, pageable);
    }

    @Transactional(readOnly = true)
    public Page<OotdListResponseDTO> getMyOotdList(PageRequestDTO pageRequestDTO, Long memberIdx) {
        Pageable pageable = pageRequestDTO.getPageable(Sort.by("id").descending());
        Page<OotdListResponseDTO> result = ootdRepository.findMyOotdList(memberIdx, pageable);

        // 썸네일이 없으면 원본 URL로 변경
        List<OotdListResponseDTO> adjustedContent = result.getContent().stream()
                .map(dto -> {
                    String adjustedImage = dto.getOotdImage() != null ?
                            adjustThumbnailUrl(dto.getOotdImage()) : null;

                    return OotdListResponseDTO.builder()
                            .ootdId(dto.getOotdId())
                            .profileImageUrl(dto.getProfileImageUrl())
                            .nickname(dto.getNickname())
                            .ootdImage(adjustedImage)
                            .isLiked(dto.getIsLiked())
                            .likeCount(dto.getLikeCount())
                            .isBookmarked(dto.getIsBookmarked())
                            .content(dto.getContent())
                            .hashtags(dto.getHashtags())
                            .products(dto.getProducts())
                            .build();
                })
                .collect(Collectors.toList());

        return new PageImpl<>(adjustedContent, pageable, result.getTotalElements());
    }

    private String adjustThumbnailUrl(String originalUrl) {
        // 원본 URL에서 썸네일 URL 생성
        String thumbnailUrl = convertToThumbnailUrl(originalUrl);

        // 썸네일 파일이 존재하는지 확인
        if (fileUploadService.fileExists(thumbnailUrl)) {
            return thumbnailUrl;
        }

        // 썸네일이 없으면 원본 URL 반환
        return originalUrl;
    }

    private String convertToThumbnailUrl(String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) {
            return imageUrl;
        }

        int lastSlashIndex = imageUrl.lastIndexOf("/");
        String fileName;
        String path;

        if (lastSlashIndex == -1) {
            fileName = imageUrl;
            path = "";
        } else {
            fileName = imageUrl.substring(lastSlashIndex + 1);
            path = imageUrl.substring(0, lastSlashIndex + 1);
        }

        // 확장자를 .jpg로 변경 (썸네일은 항상 jpg로 생성됨)
        int lastDotIndex = fileName.lastIndexOf(".");
        if (lastDotIndex != -1) {
            fileName = fileName.substring(0, lastDotIndex) + ".jpg";
        }

        return path + "s_" + fileName;
    }

    @Transactional(readOnly = true)
    public Page<OotdListResponseDTO> getLikedOotdList(PageRequestDTO pageRequestDTO, Long memberIdx) {
        Pageable pageable = pageRequestDTO.getPageable(Sort.by("id").descending());
        Page<OotdListResponseDTO> result = ootdRepository.findLikedOotdList(memberIdx, pageable);

        // 썸네일이 없으면 원본 URL로 변경
        List<OotdListResponseDTO> adjustedContent = result.getContent().stream()
                .map(dto -> {
                    String adjustedImage = dto.getOotdImage() != null ?
                            adjustThumbnailUrl(dto.getOotdImage()) : null;

                    return OotdListResponseDTO.builder()
                            .ootdId(dto.getOotdId())
                            .profileImageUrl(dto.getProfileImageUrl())
                            .nickname(dto.getNickname())
                            .ootdImage(adjustedImage)
                            .isLiked(dto.getIsLiked())
                            .likeCount(dto.getLikeCount())
                            .isBookmarked(dto.getIsBookmarked())
                            .content(dto.getContent())
                            .hashtags(dto.getHashtags())
                            .products(dto.getProducts())
                            .build();
                })
                .collect(Collectors.toList());

        return new PageImpl<>(adjustedContent, pageable, result.getTotalElements());
    }

    @Transactional(readOnly = true)
    public Page<OotdListResponseDTO> getBookmarkedOotdList(PageRequestDTO pageRequestDTO, Long memberIdx) {
        Pageable pageable = pageRequestDTO.getPageable(Sort.by("id").descending());
        Page<OotdListResponseDTO> result = ootdRepository.findBookmarkedOotdList(memberIdx, pageable);

        // 썸네일이 없으면 원본 URL로 변경
        List<OotdListResponseDTO> adjustedContent = result.getContent().stream()
                .map(dto -> {
                    String adjustedImage = dto.getOotdImage() != null ?
                            adjustThumbnailUrl(dto.getOotdImage()) : null;

                    return OotdListResponseDTO.builder()
                            .ootdId(dto.getOotdId())
                            .profileImageUrl(dto.getProfileImageUrl())
                            .nickname(dto.getNickname())
                            .ootdImage(adjustedImage)
                            .isLiked(dto.getIsLiked())
                            .likeCount(dto.getLikeCount())
                            .isBookmarked(dto.getIsBookmarked())
                            .content(dto.getContent())
                            .hashtags(dto.getHashtags())
                            .products(dto.getProducts())
                            .build();
                })
                .collect(Collectors.toList());

        return new PageImpl<>(adjustedContent, pageable, result.getTotalElements());
    }
}
