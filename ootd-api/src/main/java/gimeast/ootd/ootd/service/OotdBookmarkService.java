package gimeast.ootd.ootd.service;

import gimeast.ootd.member.entity.MemberEntity;
import gimeast.ootd.member.repository.MemberRepository;
import gimeast.ootd.ootd.entity.OotdBookmarkEntity;
import gimeast.ootd.ootd.entity.OotdEntity;
import gimeast.ootd.ootd.repository.OotdBookmarkRepository;
import gimeast.ootd.ootd.repository.OotdRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log4j2
public class OotdBookmarkService {
    private final OotdBookmarkRepository ootdBookmarkRepository;
    private final OotdRepository ootdRepository;
    private final MemberRepository memberRepository;

    /**
     * 찜하기 토글 (있으면 제거, 없으면 추가)
     * @return true: 찜하기 추가됨, false: 찜하기 제거됨
     */
    @Transactional
    public boolean toggleBookmark(Long ootdId, Long memberIdx) {
        // OOTD 조회
        OotdEntity ootd = ootdRepository.findById(ootdId)
                .orElseThrow(() -> new RuntimeException("OOTD not found"));

        // 회원 조회
        MemberEntity member = memberRepository.findById(memberIdx)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        // 기존 찜하기 확인
        Optional<OotdBookmarkEntity> existingBookmark = ootdBookmarkRepository.findByOotdEntityIdAndMemberIdx(ootdId, memberIdx);

        if (existingBookmark.isPresent()) {
            // 이미 찜하기 했으면 → 제거
            ootdBookmarkRepository.delete(existingBookmark.get());
            ootd.decrementBookmarkCount();
            log.info("Unbookmark - OOTD ID: {}, Member IDX: {}", ootdId, memberIdx);
            return false;
        } else {
            // 찜하기 안 했으면 → 추가
            OotdBookmarkEntity newBookmark = OotdBookmarkEntity.builder()
                    .ootdEntity(ootd)
                    .member(member)
                    .build();
            ootdBookmarkRepository.save(newBookmark);
            ootd.incrementBookmarkCount();
            log.info("Bookmark - OOTD ID: {}, Member IDX: {}", ootdId, memberIdx);
            return true;
        }
    }
}
