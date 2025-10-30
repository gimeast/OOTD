package gimeast.ootd.ootd.repository;

import gimeast.ootd.ootd.entity.OotdEntity;
import gimeast.ootd.ootd.entity.OotdLikeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OotdLikeRepository extends JpaRepository<OotdLikeEntity, Long> {

    /**
     * 특정 회원의 특정 OOTD 좋아요 조회
     */
    Optional<OotdLikeEntity> findByOotdEntityIdAndMemberIdx(Long ootdId, Long memberIdx);

    /**
     * 특정 회원이 특정 OOTD에 좋아요 했는지 확인
     */
    boolean existsByOotdEntityIdAndMemberIdx(Long ootdId, Long memberIdx);

    /**
     * 특정 OOTD의 모든 좋아요 삭제
     */
    void deleteByOotdEntity(OotdEntity ootdEntity);
}