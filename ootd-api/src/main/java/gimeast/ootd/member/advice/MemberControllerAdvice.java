package gimeast.ootd.member.advice;

import gimeast.ootd.member.exception.MemberTaskException;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Log4j2
public class MemberControllerAdvice {

    @ExceptionHandler(MemberTaskException.class)
    public ResponseEntity<?> handleMemberTaskException(MemberTaskException exception) {
        Map<String, Object> errors = new HashMap<>();
        errors.put("message", exception.getMsg());
        errors.put("code", exception.getCode());
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

//    ACCESS_DENIED("ACCESS_DENIED", 403)
    @ExceptionHandler(AuthorizationDeniedException.class)
    public ResponseEntity<?> handleAuthorizationDeniedException(AuthorizationDeniedException exception) {
        Map<String, Object> errors = new HashMap<>();
        errors.put("message", "권한이 없습니다.");
        errors.put("code", 401);
        return new ResponseEntity<>(errors, HttpStatus.UNAUTHORIZED);
    }
}
