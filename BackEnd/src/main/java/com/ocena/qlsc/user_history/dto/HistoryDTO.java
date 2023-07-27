package com.ocena.qlsc.user_history.dto;

import lombok.*;

import java.io.Serializable;
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class HistoryDTO{
    private String id;

    private String email;

    private Long created;

    private String object;

    private String action;

    private String description;
}
