package gimeast.ootd.ootd.controller;

import gimeast.ootd.common.dto.PageRequestDTO;
import gimeast.ootd.ootd.dto.OotdDTO;
import gimeast.ootd.ootd.dto.OotdResponseDTO;
import gimeast.ootd.ootd.service.OotdBookmarkService;
import gimeast.ootd.ootd.service.OotdLikeService;
import gimeast.ootd.ootd.service.OotdService;
import gimeast.ootd.security.auth.CustomUserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/ootd")
@Log4j2
public class OotdController {
    private final OotdService ootdService;
    private final OotdLikeService ootdLikeService;
    private final OotdBookmarkService ootdBookmarkService;

    @PostMapping
    public ResponseEntity<OotdDTO> createOotd(
            @RequestBody OotdDTO ootdDTO,
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
        OotdDTO savedOotd = ootdService.saveOotd(ootdDTO, principal.getIdx());
        return ResponseEntity.ok(savedOotd);
    }

    @PutMapping("/{ootdId}")
    public ResponseEntity<OotdDTO> updateOotd(
            @PathVariable Long ootdId,
            @RequestBody OotdDTO ootdDTO,
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
        OotdDTO updatedOotd = ootdService.updateOotd(ootdId, ootdDTO, principal.getIdx());
        return ResponseEntity.ok(updatedOotd);
    }

    @GetMapping
    public ResponseEntity<Page<OotdResponseDTO>> getOotdList(
            PageRequestDTO pageRequestDTO,
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
        Long currentMemberIdx = principal != null ? principal.getIdx() : null;
        Page<OotdResponseDTO> ootdList = ootdService.getOotdList(pageRequestDTO, currentMemberIdx);
        return ResponseEntity.ok(ootdList);
    }

    @GetMapping("/{ootdId}")
    public ResponseEntity<OotdResponseDTO> getOotd(
            @PathVariable Long ootdId,
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
        Long currentMemberIdx = principal != null ? principal.getIdx() : null;
        OotdResponseDTO ootd = ootdService.getOotd(ootdId, currentMemberIdx);
        return ResponseEntity.ok(ootd);
    }

    @GetMapping("/{ootdId}/edit")
    public ResponseEntity<OotdDTO> getOotdForEdit(
            @PathVariable Long ootdId,
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
        OotdDTO ootd = ootdService.getOotdForEdit(ootdId, principal.getIdx());
        return ResponseEntity.ok(ootd);
    }

    @GetMapping("/liked")
    public ResponseEntity<Page<OotdResponseDTO>> getLikedOotdList(
            PageRequestDTO pageRequestDTO,
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
        Page<OotdResponseDTO> likedOotdList = ootdService.getLikedOotdList(pageRequestDTO, principal.getIdx());
        return ResponseEntity.ok(likedOotdList);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<OotdResponseDTO>> searchOotdByHashtag(
            @RequestParam String keyword,
            PageRequestDTO pageRequestDTO,
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
        Long currentMemberIdx = principal != null ? principal.getIdx() : null;
        Page<OotdResponseDTO> searchResult = ootdService.searchOotdByHashtag(keyword, pageRequestDTO, currentMemberIdx);
        return ResponseEntity.ok(searchResult);
    }

    @PostMapping("/{ootdId}/like")
    public ResponseEntity<Map<String, Object>> toggleLike(
            @PathVariable Long ootdId,
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
        boolean isLiked = ootdLikeService.toggleLike(ootdId, principal.getIdx());

        return ResponseEntity.ok(Map.of(
                "message", isLiked ? "좋아요가 추가되었습니다." : "좋아요가 취소되었습니다.",
                "isLiked", isLiked
        ));
    }

    @PostMapping("/{ootdId}/bookmark")
    public ResponseEntity<Map<String, Object>> toggleBookmark(
            @PathVariable Long ootdId,
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
        boolean isLiked = ootdBookmarkService.toggleBookmark(ootdId, principal.getIdx());

        return ResponseEntity.ok(Map.of(
                "message", isLiked ? "찜하기가 추가되었습니다." : "찜하기가 취소되었습니다.",
                "isBookmarked", isLiked
        ));
    }

}
