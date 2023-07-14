package com.ocena.qlsc.common.response;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class ListResponse<T> implements Serializable {
    private Long timestamp;
    private int statusCode;
    private String statusMessage;
    private long totalRecords;
    private int totalPages;
    private List<T> data;
}
