package gimeast.ootd.member.exception;

public enum MemberExceptions {
    NOT_FOUND("회원을 찾을 수 없습니다.", 404),
    DUPLICATE("중복된 정보입니다.", 409),
    DUPLICATE_EMAIL("이미 사용 중인 이메일입니다.", 409),
    DUPLICATE_NICKNAME("이미 사용 중인 닉네임입니다.", 409),
    INVALID("유효하지 않은 정보입니다.", 400),
    INVALID_EMAIL("유효하지 않은 이메일입니다.", 400),
    INVALID_PASSWORD("유효하지 않은 비밀번호입니다.", 400),
    INVALID_NICKNAME("유효하지 않은 닉네임입니다.", 400),
    BAD_CREDENTIALS("이메일 또는 비밀번호가 잘못되었습니다.", 401);

    private MemberTaskException memberTaskException;

    MemberExceptions(String msg, int code) {
        memberTaskException = new MemberTaskException(msg, code);
    }

    public MemberTaskException get() {
        return memberTaskException;
    }
}
