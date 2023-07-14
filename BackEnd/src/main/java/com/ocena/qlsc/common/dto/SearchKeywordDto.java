package com.ocena.qlsc.common.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class SearchKeywordDto {
    private List<String> keyword;

    @Builder.Default
    private String property = "ALL";

    private int pageIndex;

    private int pageSize;
}
