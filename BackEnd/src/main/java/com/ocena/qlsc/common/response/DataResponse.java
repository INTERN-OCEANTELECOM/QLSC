package com.ocena.qlsc.common.response;

import lombok.Data;

import java.io.Serializable;

@Data
public class DataResponse<T> implements Serializable {
    private Long timestamp;
    private int statusCode;
    private String statusMessage;
    private T data;
}
