package gimeast.ootd.hashtag.repository;

import gimeast.ootd.hashtag.entity.HashtagEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HashtagRepository extends JpaRepository<HashtagEntity, Long> {
    Optional<HashtagEntity> findByTagName(String tagName);
}