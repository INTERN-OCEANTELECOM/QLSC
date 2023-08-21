package com.ocena.qlsc.common.error.exception;

import com.ocena.qlsc.common.response.ErrorResponseImport;

import java.util.LinkedList;
import java.util.List;

public final class InvalidHeaderException extends RuntimeException {
    private List<ErrorResponseImport> listErrors;

    public InvalidHeaderException(List<ErrorResponseImport> listErrors) {
        this.listErrors = listErrors;
    }

    public List<ErrorResponseImport> getListErrors() {
        return listErrors;
    }
}
