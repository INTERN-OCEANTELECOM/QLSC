package com.ocena.qlsc.user_history.dto;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class HistoryResponse {
    private String id;

    private String email;

    private Long created;

    private String object;

    private String action;

    private String description;

    private String filePath;
}
