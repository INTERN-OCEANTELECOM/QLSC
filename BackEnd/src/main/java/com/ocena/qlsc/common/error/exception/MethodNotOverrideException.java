package com.ocena.qlsc.common.error.exception;

public class MethodNotOverrideException extends RuntimeException{
    private static final String DEFAULT_MESSAGE = "API cannot be used without overriding.";

    public MethodNotOverrideException() {
        super(DEFAULT_MESSAGE);
    }
}
