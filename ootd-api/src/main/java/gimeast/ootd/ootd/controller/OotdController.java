package gimeast.ootd.ootd.controller;

import gimeast.ootd.ootd.dto.OotdDTO;
import gimeast.ootd.ootd.service.OotdService;
import gimeast.ootd.security.auth.CustomUserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
        log.info("Creating OOTD: {}", ootdDTO);
        log.info("Member idx from token: {}", principal.getIdx());

        OotdDTO savedOotd = ootdService.saveOotd(ootdDTO, principal.getIdx());
        return ResponseEntity.ok(savedOotd);
    }
}
