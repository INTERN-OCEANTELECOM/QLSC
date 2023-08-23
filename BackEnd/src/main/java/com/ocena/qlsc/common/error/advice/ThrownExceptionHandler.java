package com.ocena.qlsc.common.error.advice;

import com.ocena.qlsc.common.error.exception.*;
import com.ocena.qlsc.common.constants.message.StatusCode;
import com.ocena.qlsc.common.constants.message.StatusMessage;
import com.ocena.qlsc.common.response.DataResponse;
import com.ocena.qlsc.common.response.ListResponse;
import com.ocena.qlsc.common.response.ResponseMapper;
import lombok.extern.log4j.Log4j2;
import org.apache.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class ThrownExceptionHandler {
    private final static Logger logger = Logger.getLogger(ThrownExceptionHandler.class);

    @ExceptionHandler({DataNotFoundException.class})
    public ResponseEntity<DataResponse<?>> handleDataNotFound(final RuntimeException e) {
        logger.error(e.getMessage());
        DataResponse<?> response = ResponseMapper.toDataResponse(e.getMessage(),
                StatusCode.DATA_NOT_FOUND, StatusMessage.DATA_NOT_FOUND);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @ExceptionHandler({DataAlreadyExistException.class})
    public ResponseEntity<DataResponse<?>> handleDataAlreadyExist(final RuntimeException e) {
        logger.error(e.getMessage());
        DataResponse<?> response = ResponseMapper.toDataResponse(e.getMessage(),
                StatusCode.NOT_IMPLEMENTED, StatusMessage.NOT_IMPLEMENTED);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // findById response is null
    @ExceptionHandler({ResourceNotFoundException.class})
    public ResponseEntity<DataResponse<?>> handleResourceNotFound(final RuntimeException e) {
        logger.error(e.getMessage());
        DataResponse<?> response = ResponseMapper.toDataResponse(e.getMessage(),
                StatusCode.DATA_NOT_FOUND, StatusMessage.DATA_NOT_FOUND);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @ExceptionHandler({NotPermissionException.class})
    public ResponseEntity<ListResponse<?>> handleNotPermission(final RuntimeException e) {
        logger.error(e.getMessage());
        ListResponse<?> response = ResponseMapper.toListResponse(null, 0, 0,
                StatusCode.LOCK_ACCESS, StatusMessage.NOT_PERMISSION);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @ExceptionHandler({InvalidTimeException.class})
    public ResponseEntity<DataResponse<?>> handleInvalidTime(final RuntimeException e) {
        logger.error(e.getMessage());
        DataResponse<?> response = ResponseMapper.toDataResponse(e.getMessage(),
                StatusCode.DATA_NOT_MAP, StatusMessage.DATA_NOT_MAP);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @ExceptionHandler({FunctionLimitedTimeException.class})
    public ResponseEntity<DataResponse<?>> handleFunctionLimitedTimeException(final RuntimeException e) {
        logger.error(e.getMessage());
        DataResponse<?> response = ResponseMapper.toDataResponse(e.getMessage(),
                StatusCode.DATA_NOT_FOUND, StatusMessage.DATA_NOT_FOUND);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @ExceptionHandler({InvalidHeaderException.class})
    public ResponseEntity<ListResponse<?>> handleInvalidHeaderException(final InvalidHeaderException e) {
        logger.error(e.getListErrors());
        ListResponse<?> response = ResponseMapper.toListResponse(e.getListErrors(), 0, 0,
                StatusCode.DATA_NOT_MAP, StatusMessage.DATA_NOT_MAP);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @ExceptionHandler({LockAccessException.class})
    public ResponseEntity<DataResponse<?>> handleLockAccessException(final RuntimeException e) {
        logger.error(e.getMessage());
        DataResponse<?> response = ResponseMapper.toDataResponse(e.getMessage(),
                StatusCode.LOCK_ACCESS, StatusMessage.LOCK_ACCESS);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @ExceptionHandler({FileUploadException.class})
    public ResponseEntity<DataResponse<?>> handleFileUploadException(final RuntimeException e) {
        logger.error(e.getMessage());
        DataResponse<?> response = ResponseMapper.toDataResponse(e.getMessage(),
                StatusCode.DATA_NOT_MAP, StatusMessage.DATA_NOT_MAP);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @ExceptionHandler({MethodNotOverrideException.class})
    public ResponseEntity<DataResponse<?>> handleMethodNotOverrideException(final RuntimeException e) {
        logger.error(e.getMessage());
        DataResponse<?> response = ResponseMapper.toDataResponse(e.getMessage(),
                StatusCode.NOT_IMPLEMENTED, StatusMessage.NOT_IMPLEMENTED);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
