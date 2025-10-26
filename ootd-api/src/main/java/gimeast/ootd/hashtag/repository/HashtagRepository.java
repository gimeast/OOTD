package gimeast.ootd.hashtag.repository;

import gimeast.ootd.hashtag.entity.HashtagEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface HashtagRepository extends JpaRepository<HashtagEntity, Long> {
    Optional<HashtagEntity> findByTagName(String tagName);

    @Query("SELECT h FROM HashtagEntity h ORDER BY h.usageCount DESC, h.id DESC LIMIT :limit")
    List<HashtagEntity> findTopByOrderByUsageCountDesc(@Param("limit") int limit);
}