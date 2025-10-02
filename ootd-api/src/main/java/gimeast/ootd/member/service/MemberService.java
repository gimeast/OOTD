package gimeast.ootd.member.service;

import gimeast.ootd.member.dto.MemberDTO;
import gimeast.ootd.member.entity.MemberEntity;
import gimeast.ootd.member.entity.MemberRole;
import gimeast.ootd.member.exception.MemberExceptions;
import gimeast.ootd.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Log4j2
public class MemberService {
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    public MemberDTO read(String email, String mpw) {
        Optional<MemberEntity> result = memberRepository.findByEmail(email);
        MemberEntity memberEntity = result.orElseThrow(MemberExceptions.BAD_CREDENTIALS::get);

        String decodedPassword = decodeBase64Password(mpw);
        if (!passwordEncoder.matches(decodedPassword, memberEntity.getMpw())) {
            throw MemberExceptions.BAD_CREDENTIALS.get();
        }
        return new MemberDTO(memberEntity);
    }

    public MemberDTO getByEmail(String email) {
        Optional<MemberEntity> result = memberRepository.findByEmail(email);
        MemberEntity memberEntity = result.orElseThrow(MemberExceptions.NOT_FOUND::get);
        return new MemberDTO(memberEntity);
    }

    public Long join(MemberDTO memberDTO) {
        // 필수 항목 검증
        if (memberDTO.getEmail() == null || memberDTO.getEmail().trim().isEmpty()) {
            throw MemberExceptions.INVALID_EMAIL.get();
        }
        if (memberDTO.getMpw() == null || memberDTO.getMpw().trim().isEmpty()) {
            throw MemberExceptions.INVALID_PASSWORD.get();
        }
        if (memberDTO.getNickname() == null || memberDTO.getNickname().trim().isEmpty()) {
            throw MemberExceptions.INVALID_NICKNAME.get();
        }

        // 중복 검증
        if (memberRepository.findByEmail(memberDTO.getEmail()).isPresent()) {
            throw MemberExceptions.DUPLICATE_EMAIL.get();
        }
        if (memberRepository.findByNickname(memberDTO.getNickname()).isPresent()) {
            throw MemberExceptions.DUPLICATE_NICKNAME.get();
        }

        Set<MemberRole> roleSet = new HashSet<>();
        roleSet.add(MemberRole.USER);

        String decodedPassword = decodeBase64Password(memberDTO.getMpw());

        MemberEntity newMember = MemberEntity.builder()
                .mpw(passwordEncoder.encode(decodedPassword))
                .name(memberDTO.getName())
                .nickname(memberDTO.getNickname())
                .email(memberDTO.getEmail())
                .roleSet(roleSet)
                .build();

        memberRepository.save(newMember);

        return newMember.getIdx();
    }

    private String decodeBase64Password(String encodedPassword) {
        try {
            byte[] decodedBytes = Base64.getDecoder().decode(encodedPassword);
            return new String(decodedBytes);
        } catch (IllegalArgumentException e) {
            // Base64 형식이 아닌 경우 예외 처리
            log.error("비밀번호가 유효한 Base64 형식이 아닙니다: {}", e.getMessage());
            throw MemberExceptions.INVALID.get();
        }
    }

}
