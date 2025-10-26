package gimeast.ootd.hashtag.controller;

import gimeast.ootd.hashtag.entity.HashtagEntity;
import gimeast.ootd.hashtag.service.HashtagService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/hashtag")
@Log4j2
public class HashtagController {
    private final HashtagService hashtagService;

    @GetMapping("/popular")
    public ResponseEntity<List<HashtagEntity>> getPopularHashtags() {
        List<HashtagEntity> popularHashtags = hashtagService.getPopularHashtags(8);
        return ResponseEntity.ok(popularHashtags);
    }
}