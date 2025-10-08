package gimeast.ootd.ootd.service;

import gimeast.ootd.hashtag.entity.HashtagEntity;
import gimeast.ootd.hashtag.repository.HashtagRepository;
import gimeast.ootd.member.entity.MemberEntity;
import gimeast.ootd.member.repository.MemberRepository;
import gimeast.ootd.ootd.dto.OotdDTO;
import gimeast.ootd.ootd.entity.OotdEntity;
import gimeast.ootd.ootd.entity.OotdHashtagEntity;
import gimeast.ootd.ootd.entity.OotdImageEntity;
import gimeast.ootd.ootd.entity.OotdProductEntity;
import gimeast.ootd.ootd.repository.OotdRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Log4j2
public class OotdService {
    private final OotdRepository ootdRepository;
    private final MemberRepository memberRepository;
    private final HashtagRepository hashtagRepository;

    @Transactional
    public OotdDTO saveOotd(OotdDTO ootdDTO) {
        // Member 조회
        MemberEntity member = memberRepository.findById(ootdDTO.getMember().getIdx())
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
                    .map(productDTO -> OotdProductEntity.builder()
                            .ootdEntity(ootdEntity)
                            .productName(productDTO.getProductName())
                            .productLink(productDTO.getProductLink())
                            .displayOrder(productDTO.getDisplayOrder())
                            .build())
                    .toList();

            products.forEach(ootdEntity::addProduct);
        }

        // 저장
        OotdEntity savedEntity = ootdRepository.save(ootdEntity);

        return new OotdDTO(savedEntity);
    }
}
