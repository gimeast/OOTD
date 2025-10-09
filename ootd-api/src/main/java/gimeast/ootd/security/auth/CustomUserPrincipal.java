package gimeast.ootd.security.auth;

import lombok.RequiredArgsConstructor;

import java.security.Principal;

@RequiredArgsConstructor
public class CustomUserPrincipal implements Principal {
    private final Long idx;
    private final String email;

    @Override
    public String getName() {
        return email;
    }

    public Long getIdx() {
        return idx;
    }
}
