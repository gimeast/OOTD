package gimeast.ootd.ootd.controller;

import gimeast.ootd.common.dto.PageRequestDTO;
import gimeast.ootd.ootd.dto.OotdDTO;
import gimeast.ootd.ootd.dto.OotdListResponseDTO;
import gimeast.ootd.ootd.service.OotdService;
import gimeast.ootd.security.auth.CustomUserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/ootd")
@Log4j2
public class OotdController {
    private final OotdService ootdService;

    @PostMapping
    public ResponseEntity<OotdDTO> createOotd(
            @RequestBody OotdDTO ootdDTO,
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
        OotdDTO savedOotd = ootdService.saveOotd(ootdDTO, principal.getIdx());
        return ResponseEntity.ok(savedOotd);
    }

    @GetMapping
    public ResponseEntity<Page<OotdListResponseDTO>> getOotdList(
            PageRequestDTO pageRequestDTO,
            @AuthenticationPrincipal CustomUserPrincipal principal
    ) {
        Long currentMemberIdx = principal != null ? principal.getIdx() : null;
        Page<OotdListResponseDTO> ootdList = ootdService.getOotdList(pageRequestDTO, currentMemberIdx);
        return ResponseEntity.ok(ootdList);
    }

}
