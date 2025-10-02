package gimeast.ootd.member.controller;

import gimeast.ootd.member.dto.MemberDTO;
import gimeast.ootd.member.service.MemberService;
import gimeast.ootd.security.auth.CustomUserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/members")
@Log4j2
public class MemberController {
    private final MemberService memberService;

    @GetMapping("/info")
    public ResponseEntity<MemberDTO> getMemberDTO(@AuthenticationPrincipal CustomUserPrincipal principal) {
        log.info("Get member info for: {}", principal.getName());
        MemberDTO memberDTO = memberService.getByEmail(principal.getName());
        return ResponseEntity.ok(memberDTO);
    }
}
