package com.ocena.qlsc.common.exception;

import com.ocena.qlsc.common.message.StatusCode;
import com.ocena.qlsc.common.message.StatusMessage;
import com.ocena.qlsc.common.response.DataResponse;
import com.ocena.qlsc.common.response.ResponseMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import java.sql.SQLIntegrityConstraintViolationException;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseBody
    public ResponseEntity<DataResponse<?>> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex) {
        DataResponse<?> response = ResponseMapper.toDataResponse("Dữ liệu không đúng định dạng",
                StatusCode.DATA_NOT_MAP, StatusMessage.DATA_NOT_MAP);
        return new ResponseEntity<>(response, HttpStatus.NOT_IMPLEMENTED);
    }
    @ExceptionHandler(SQLIntegrityConstraintViolationException.class)
    @ResponseBody
    public ResponseEntity<DataResponse<?>> handleSQLIntegrityConstraintViolationException(SQLIntegrityConstraintViolationException ex) {
        DataResponse<?> response = ResponseMapper.toDataResponse("Dữ liệu đã tồn tại",
                StatusCode.NOT_IMPLEMENTED, StatusMessage.NOT_IMPLEMENTED);
        return new ResponseEntity<>(response, HttpStatus.NOT_IMPLEMENTED);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseBody
    public ResponseEntity<DataResponse<?>> handleInvalidArgument(MethodArgumentNotValidException ex) {
        List<String> errors = new ArrayList<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            errors.add(error.getDefaultMessage());
        });
        DataResponse<?> response = ResponseMapper.toDataResponse(errors,
                StatusCode.DATA_NOT_MAP, StatusMessage.DATA_NOT_MAP);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = {ApiRequestException.class})
    public ResponseEntity<Object> handlerApiRequestException(ApiRequestException e) {
        // 1. Create payload containing exception details
        ApiException apiException = new ApiException(
                e.getMessage(),
                e,
                HttpStatus.BAD_REQUEST,
                ZonedDateTime.now(ZoneId.of("Z"))
        );
        // 2. Return response entity
        return new ResponseEntity<>(apiException, HttpStatus.BAD_REQUEST);
    }
}
