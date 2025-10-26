package gimeast.ootd.hashtag.service;

import gimeast.ootd.hashtag.entity.HashtagEntity;
import gimeast.ootd.hashtag.repository.HashtagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Log4j2
public class HashtagService {
    private final HashtagRepository hashtagRepository;

    @Transactional(readOnly = true)
    public List<HashtagEntity> getPopularHashtags(int limit) {
        return hashtagRepository.findTopByOrderByUsageCountDesc(limit);
    }
}