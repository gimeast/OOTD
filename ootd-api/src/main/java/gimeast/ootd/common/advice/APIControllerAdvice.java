package gimeast.ootd.common.advice;

import gimeast.ootd.common.exception.EntityNotFoundException;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Log4j2
public class APIControllerAdvice {
    /**
     * 컨트롤러의 메서드 인자 유효성 검증(@Validated) 실패 시 발생하는 예외
     * @param exception
     * @return
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleArgsException(MethodArgumentNotValidException exception) {
        Map<String, Object> errors = new HashMap<>();
        exception.getBindingResult().getFieldErrors()
                .forEach(fieldError -> errors.put(fieldError.getField(), fieldError.getDefaultMessage()));
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    /**
     * 컨트롤러의 메서드 인자 타입과 일치하지 않는 값을 전달 받은 경우 예외 발생
     * @param exception
     * @return
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<?> handleArgsException(MethodArgumentTypeMismatchException exception) {
        Map<String, String> errors = new HashMap<>();
        errors.put("error", "Type Mismatched");
        errors.put(exception.getName(), exception.getValue() + " is not valid value");
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    /**
     * 없는 값을 조회 할 경우
     * @param exception
     * @return
     */
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<?> handleEntityNotFoundException(EntityNotFoundException exception) {
        Map<String, Object> errors = new HashMap<>();
        errors.put("message", "Entity Not Found");
        errors.put("code", exception.getCode());
        return new ResponseEntity<>(errors, HttpStatus.NOT_FOUND);
    }
}
