package gimeast.ootd.member.exception;

public enum MemberExceptions {
    NOT_FOUND("NOT_FOUND", 404),
    DUPLICATE("DUPLICATE", 409),
    DUPLICATE_EMAIL("DUPLICATE_EMAIL", 409),
    DUPLICATE_NICKNAME("DUPLICATE_NICKNAME", 409),
    INVALID("INVALID", 400),
    INVALID_EMAIL("INVALID_EMAIL", 400),
    INVALID_PASSWORD("INVALID_PASSWORD", 400),
    INVALID_NICKNAME("INVALID_NICKNAME", 400),
    BAD_CREDENTIALS("BAD_CREDENTIALS", 401);

    private MemberTaskException memberTaskException;

    MemberExceptions(String msg, int code) {
        memberTaskException = new MemberTaskException(msg, code);
    }

    public MemberTaskException get() {
        return memberTaskException;
    }
}
