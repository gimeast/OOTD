package gimeast.ootd.member.controller;

import gimeast.ootd.common.dto.PageRequestDTO;
import gimeast.ootd.member.dto.MemberStatsDTO;
import gimeast.ootd.member.service.MemberService;
import gimeast.ootd.ootd.dto.OotdListResponseDTO;
import gimeast.ootd.ootd.service.OotdService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<Page<OotdListResponseDTO>> getMemberOotdList(
            @PathVariable String nickname,
            PageRequestDTO pageRequestDTO
    ) {
        Long memberIdx = memberService.getByNickname(nickname).getIdx();
        Page<OotdListResponseDTO> ootdList = ootdService.getMyOotdList(pageRequestDTO, memberIdx);
        return ResponseEntity.ok(ootdList);
    }

    @GetMapping("/{nickname}/liked-posts")
    public ResponseEntity<Page<OotdListResponseDTO>> getMemberLikedOotdList(
            @PathVariable String nickname,
            PageRequestDTO pageRequestDTO
    ) {
        Long memberIdx = memberService.getByNickname(nickname).getIdx();
        Page<OotdListResponseDTO> likedOotdList = ootdService.getLikedOotdList(pageRequestDTO, memberIdx);
        return ResponseEntity.ok(likedOotdList);
    }

    @GetMapping("/{nickname}/bookmarked-posts")
    public ResponseEntity<Page<OotdListResponseDTO>> getMemberBookmarkedOotdList(
            @PathVariable String nickname,
            PageRequestDTO pageRequestDTO
    ) {
        Long memberIdx = memberService.getByNickname(nickname).getIdx();
        Page<OotdListResponseDTO> bookmarkedOotdList = ootdService.getBookmarkedOotdList(pageRequestDTO, memberIdx);
        return ResponseEntity.ok(bookmarkedOotdList);
    }
}
