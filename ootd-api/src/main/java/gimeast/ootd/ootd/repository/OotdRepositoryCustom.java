package gimeast.ootd.ootd.repository;

import gimeast.ootd.ootd.dto.OotdResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OotdRepositoryCustom {
    OotdResponseDTO findOotd(Long currentMemberIdx, Long ootdId);
    Page<OotdResponseDTO> findOotdList(Long currentMemberIdx, Pageable pageable);
    Page<OotdResponseDTO> findMyOotdList(Long memberIdx, Pageable pageable);
    Page<OotdResponseDTO> findLikedOotdList(Long memberIdx, Pageable pageable);
    Page<OotdResponseDTO> findBookmarkedOotdList(Long memberIdx, Pageable pageable);
    Page<OotdResponseDTO> findByHashtag(String hashtag, Long currentMemberIdx, Pageable pageable);
    Page<OotdResponseDTO> findByNickname(String nickname, Long currentMemberIdx, Pageable pageable);
    long countMyOotd(Long memberIdx);
}