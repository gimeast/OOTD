package gimeast.ootd.ootd.service;

import gimeast.ootd.member.entity.MemberEntity;
import gimeast.ootd.member.repository.MemberRepository;
import gimeast.ootd.ootd.entity.OotdEntity;
import gimeast.ootd.ootd.entity.OotdLikeEntity;
import gimeast.ootd.ootd.repository.OotdLikeRepository;
import gimeast.ootd.ootd.repository.OotdRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log4j2
public class OotdLikeService {

    private final OotdLikeRepository ootdLikeRepository;
    private final OotdRepository ootdRepository;
    private final MemberRepository memberRepository;

    /**
     * 좋아요 토글 (있으면 제거, 없으면 추가)
     * @return true: 좋아요 추가됨, false: 좋아요 제거됨
     */
    @Transactional
    public boolean toggleLike(Long ootdId, Long memberIdx) {
        // OOTD 조회
        OotdEntity ootd = ootdRepository.findById(ootdId)
                .orElseThrow(() -> new RuntimeException("OOTD not found"));

        // 회원 조회
        MemberEntity member = memberRepository.findById(memberIdx)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        // 기존 좋아요 확인
        Optional<OotdLikeEntity> existingLike = ootdLikeRepository.findByOotdEntityIdAndMemberIdx(ootdId, memberIdx);

        if (existingLike.isPresent()) {
            // 이미 좋아요 했으면 → 제거
            ootdLikeRepository.delete(existingLike.get());
            ootd.decrementLikeCount();
            log.info("Unlike - OOTD ID: {}, Member IDX: {}", ootdId, memberIdx);
            return false;
        } else {
            // 좋아요 안 했으면 → 추가
            OotdLikeEntity newLike = OotdLikeEntity.builder()
                    .ootdEntity(ootd)
                    .member(member)
                    .build();
            ootdLikeRepository.save(newLike);
            ootd.incrementLikeCount();
            log.info("Like - OOTD ID: {}, Member IDX: {}", ootdId, memberIdx);
            return true;
        }
    }

    /**
     * 좋아요 여부 확인
     */
    @Transactional(readOnly = true)
    public boolean isLiked(Long ootdId, Long memberIdx) {
        return ootdLikeRepository.existsByOotdEntityIdAndMemberIdx(ootdId, memberIdx);
    }
}