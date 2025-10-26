package gimeast.ootd.member.repository;

import gimeast.ootd.member.entity.MemberEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<MemberEntity, Long> {
    Optional<MemberEntity> findByEmail(String email);

    Optional<MemberEntity> findByNickname(String nickname);

    @Query("SELECT m FROM MemberEntity m LEFT JOIN FETCH m.roleSet WHERE m.email = :email")
    Optional<MemberEntity> findByEmailWithRoles(@Param("email") String email);

    @Query("SELECT m FROM MemberEntity m LEFT JOIN FETCH m.roleSet WHERE m.idx = :idx")
    Optional<MemberEntity> findByIdWithRoles(@Param("idx") Long idx);

    @Query("SELECT m FROM MemberEntity m WHERE m.nickname LIKE %:keyword%")
    Page<MemberEntity> searchByNickname(@Param("keyword") String keyword, Pageable pageable);
}
