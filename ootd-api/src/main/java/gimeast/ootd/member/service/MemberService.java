package gimeast.ootd.member.service;

import gimeast.ootd.member.dto.MemberDTO;
import gimeast.ootd.member.dto.MemberStatsDTO;
import gimeast.ootd.member.entity.MemberEntity;
import gimeast.ootd.member.entity.MemberRole;
import gimeast.ootd.member.exception.MemberExceptions;
import gimeast.ootd.member.repository.MemberRepository;
import gimeast.ootd.ootd.repository.OotdRepository;
import gimeast.ootd.upload.service.FileUploadService;
import gimeast.ootd.upload.service.ImageUploadResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Log4j2
public class MemberService {
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final OotdRepository ootdRepository;
    private final FileUploadService fileUploadService;

    public MemberDTO read(String email, String password) {
        Optional<MemberEntity> result = memberRepository.findByEmail(email);
        MemberEntity memberEntity = result.orElseThrow(MemberExceptions.BAD_CREDENTIALS::get);

        String decodedPassword = decodeBase64Password(password);
        if (!passwordEncoder.matches(decodedPassword, memberEntity.getPassword())) {
            throw MemberExceptions.BAD_CREDENTIALS.get();
        }
        return new MemberDTO(memberEntity);
    }

    public MemberDTO getByEmail(String email) {
        Optional<MemberEntity> result = memberRepository.findByEmail(email);
        MemberEntity memberEntity = result.orElseThrow(MemberExceptions.NOT_FOUND::get);
        return new MemberDTO(memberEntity);
    }

    public MemberDTO getByIdx(Long idx) {
        Optional<MemberEntity> result = memberRepository.findById(idx);
        MemberEntity memberEntity = result.orElseThrow(MemberExceptions.NOT_FOUND::get);
        return new MemberDTO(memberEntity);
    }

    public MemberDTO getByNickname(String nickname) {
        Optional<MemberEntity> result = memberRepository.findByNickname(nickname);
        MemberEntity memberEntity = result.orElseThrow(MemberExceptions.NOT_FOUND::get);
        return new MemberDTO(memberEntity);
    }

    public Long join(MemberDTO memberDTO) {
        // 필수 항목 검증
        if (memberDTO.getEmail() == null || memberDTO.getEmail().trim().isEmpty()) {
            throw MemberExceptions.INVALID_EMAIL.get();
        }
        if (memberDTO.getPassword() == null || memberDTO.getPassword().trim().isEmpty()) {
            throw MemberExceptions.INVALID_PASSWORD.get();
        }
        if (memberDTO.getNickname() == null || memberDTO.getNickname().trim().isEmpty()) {
            throw MemberExceptions.INVALID_NICKNAME.get();
        }
        if (memberDTO.getAllAgreed() == null || !memberDTO.getAllAgreed()) {
            throw MemberExceptions.ALL_TERMS_NOT_AGREED.get();
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

        String decodedPassword = decodeBase64Password(memberDTO.getPassword());

        MemberEntity newMember = MemberEntity.builder()
                .password(passwordEncoder.encode(decodedPassword))
                .name(memberDTO.getName())
                .nickname(memberDTO.getNickname())
                .email(memberDTO.getEmail())
                .allAgreed(memberDTO.getAllAgreed())
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

    public boolean isEmailAvailable(String email) {
        Optional<MemberEntity> byEmail = memberRepository.findByEmail(email);
        return byEmail.isEmpty();
    }

    public boolean isNicknameAvailable(String nickname) {
        Optional<MemberEntity> byNickname = memberRepository.findByNickname(nickname);
        return byNickname.isEmpty();
    }

    public MemberStatsDTO getMemberStats(Long memberIdx) {
        // 게시물 수 조회
        long postCount = ootdRepository.countMyOotd(memberIdx);

        // 추후 팔로워/팔로잉 기능 구현 시 추가
        return MemberStatsDTO.builder()
                .postCount(postCount)
                .followerCount(0L)  // 추후 구현
                .followingCount(0L) // 추후 구현
                .build();
    }

    @Transactional
    public String updateProfileImage(Long memberIdx, MultipartFile[] files) {
        try {
            // 파일이 없거나 비어있는 경우
            if (files == null || files.length == 0) {
                throw new RuntimeException("업로드할 파일이 없습니다.");
            }

            // 파일 업로드 (첫 번째 파일만 사용)
            List<ImageUploadResult> results = fileUploadService.uploadImages(files);

            if (results.isEmpty()) {
                throw new RuntimeException("파일 업로드에 실패했습니다.");
            }

            String profileImageUrl = results.get(0).getImageUrl();

            // DB 업데이트
            MemberEntity member = memberRepository.findById(memberIdx)
                    .orElseThrow(MemberExceptions.NOT_FOUND::get);

            // 기존 프로필 이미지가 있으면 삭제
            if (member.getProfileImageUrl() != null && !member.getProfileImageUrl().isEmpty()) {
                fileUploadService.deleteFile(member.getProfileImageUrl());
            }

            member.changeProfileImage(profileImageUrl);
            memberRepository.save(member);

            log.info("Profile image updated for member idx: {}, url: {}", memberIdx, profileImageUrl);

            return profileImageUrl;
        } catch (IOException e) {
            log.error("Profile image upload failed: {}", e.getMessage());
            throw new RuntimeException("프로필 이미지 업로드에 실패했습니다.", e);
        }
    }

    @Transactional
    public void resetProfileImage(Long memberIdx) {
        // 회원 조회
        MemberEntity member = memberRepository.findById(memberIdx)
                .orElseThrow(MemberExceptions.NOT_FOUND::get);

        // 기존 프로필 이미지가 있으면 삭제
        if (member.getProfileImageUrl() != null && !member.getProfileImageUrl().isEmpty()) {
            try {
                fileUploadService.deleteFile(member.getProfileImageUrl());
            } catch (Exception e) {
                log.error("Failed to delete existing profile image: {}", e.getMessage());
                // 파일 삭제 실패해도 계속 진행
            }
        }

        // 프로필 이미지를 null로 설정 (기본 이미지로 되돌림)
        member.changeProfileImage(null);
        memberRepository.save(member);

        log.info("Profile image reset to default for member idx: {}", memberIdx);
    }
}
