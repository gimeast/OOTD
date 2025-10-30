package gimeast.ootd.ootd.repository;

import gimeast.ootd.ootd.entity.OotdBookmarkEntity;
import gimeast.ootd.ootd.entity.OotdEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OotdBookmarkRepository extends JpaRepository<OotdBookmarkEntity, Long> {
    /**
     * 특정 회원의 특정 OOTD 찜하기 조회
     */
    Optional<OotdBookmarkEntity> findByOotdEntityIdAndMemberIdx(Long ootdId, Long memberIdx);

    /**
     * 특정 OOTD의 모든 북마크 삭제
     */
    void deleteByOotdEntity(OotdEntity ootdEntity);
}
