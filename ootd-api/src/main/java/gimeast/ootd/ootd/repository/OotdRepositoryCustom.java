package gimeast.ootd.ootd.repository;

import gimeast.ootd.ootd.dto.OotdListResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OotdRepositoryCustom {
    Page<OotdListResponseDTO> findOotdList(Long currentMemberIdx, Pageable pageable);
    Page<OotdListResponseDTO> findMyOotdList(Long memberIdx, Pageable pageable);
    Page<OotdListResponseDTO> findLikedOotdList(Long memberIdx, Pageable pageable);
    Page<OotdListResponseDTO> findBookmarkedOotdList(Long memberIdx, Pageable pageable);
    Page<OotdListResponseDTO> findByHashtag(String hashtag, Long currentMemberIdx, Pageable pageable);
    Page<OotdListResponseDTO> findByNickname(String nickname, Long currentMemberIdx, Pageable pageable);
    long countMyOotd(Long memberIdx);
}