package gimeast.ootd.ootd.repository;

import gimeast.ootd.ootd.dto.OotdListResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OotdRepositoryCustom {
    Page<OotdListResponseDTO> findOotdList(Long currentMemberIdx, Pageable pageable);
}