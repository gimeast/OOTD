package gimeast.ootd.ootd.controller;

import gimeast.ootd.ootd.dto.OotdDTO;
import gimeast.ootd.ootd.service.OotdService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<OotdDTO> createOotd(@RequestBody OotdDTO ootdDTO) {
        log.info("Creating OOTD: {}", ootdDTO);
        OotdDTO savedOotd = ootdService.saveOotd(ootdDTO);
        return ResponseEntity.ok(savedOotd);
    }
}
