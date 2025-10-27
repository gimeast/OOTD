package gimeast.ootd.member.controller;

import gimeast.ootd.common.dto.PageRequestDTO;
import gimeast.ootd.member.dto.MemberSearchDTO;
import gimeast.ootd.member.dto.MemberStatsDTO;
import gimeast.ootd.member.service.MemberService;
import gimeast.ootd.ootd.dto.OotdResponseDTO;
import gimeast.ootd.ootd.service.OotdService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/member")
@Log4j2
public class MemberController {
    private final MemberService memberService;
    private final OotdService ootdService;

    @GetMapping("/{nickname}/stats")
    public ResponseEntity<MemberStatsDTO> getMemberStats(
            @PathVariable String nickname
    ) {
        Long memberIdx = memberService.getByNickname(nickname).getIdx();
        MemberStatsDTO stats = memberService.getMemberStats(memberIdx);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/{nickname}/posts")
    public ResponseEntity<Page<OotdResponseDTO>> getMemberOotdList(
            @PathVariable String nickname,
            PageRequestDTO pageRequestDTO
    ) {
        Long memberIdx = memberService.getByNickname(nickname).getIdx();
        Page<OotdResponseDTO> ootdList = ootdService.getMyOotdList(pageRequestDTO, memberIdx);
        return ResponseEntity.ok(ootdList);
    }

    @GetMapping("/{nickname}/liked-posts")
    public ResponseEntity<Page<OotdResponseDTO>> getMemberLikedOotdList(
            @PathVariable String nickname,
            PageRequestDTO pageRequestDTO
    ) {
        Long memberIdx = memberService.getByNickname(nickname).getIdx();
        Page<OotdResponseDTO> likedOotdList = ootdService.getLikedOotdList(pageRequestDTO, memberIdx);
        return ResponseEntity.ok(likedOotdList);
    }

    @GetMapping("/{nickname}/bookmarked-posts")
    public ResponseEntity<Page<OotdResponseDTO>> getMemberBookmarkedOotdList(
            @PathVariable String nickname,
            PageRequestDTO pageRequestDTO
    ) {
        Long memberIdx = memberService.getByNickname(nickname).getIdx();
        Page<OotdResponseDTO> bookmarkedOotdList = ootdService.getBookmarkedOotdList(pageRequestDTO, memberIdx);
        return ResponseEntity.ok(bookmarkedOotdList);
    }

    @PatchMapping("/profile-img")
    public ResponseEntity<Map<String, Object>> updateProfileImage(
            @RequestParam("images") MultipartFile[] files,
            @AuthenticationPrincipal gimeast.ootd.security.auth.CustomUserPrincipal principal
    ) {
        String profileImageUrl = memberService.updateProfileImage(principal.getIdx(), files);

        return ResponseEntity.ok(Map.of(
                "message", "프로필 이미지가 변경되었습니다.",
                "profileImageUrl", profileImageUrl
        ));
    }

    @PatchMapping("/profile-img/reset")
    public ResponseEntity<Map<String, Object>> resetProfileImage(
            @AuthenticationPrincipal gimeast.ootd.security.auth.CustomUserPrincipal principal
    ) {
        memberService.resetProfileImage(principal.getIdx());

        Map<String, Object> response = new HashMap<>();
        response.put("message", "프로필 이미지가 기본 이미지로 변경되었습니다.");
        response.put("profileImageUrl", null);

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/bio")
    public ResponseEntity<Map<String, Object>> updateBio(
            @RequestParam String bio,
            @AuthenticationPrincipal gimeast.ootd.security.auth.CustomUserPrincipal principal
    ) {
        String updatedBio = memberService.updateBio(principal.getIdx(), bio);

        return ResponseEntity.ok(Map.of(
                "message", "자기소개가 변경되었습니다.",
                "bio", updatedBio != null ? updatedBio : ""
        ));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<MemberSearchDTO>> searchByNickname(
            @RequestParam String keyword,
            PageRequestDTO pageRequestDTO
    ) {
        Page<MemberSearchDTO> searchResult = memberService.searchByNickname(keyword, pageRequestDTO.getPageable());
        return ResponseEntity.ok(searchResult);
    }

}
