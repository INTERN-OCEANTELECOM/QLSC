package com.ocena.qlsc.po.dto;

import jakarta.validation.constraints.Size;
import lombok.*;

import java.io.Serial;
import java.io.Serializable;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PoResponse implements Serializable {
    @Serial
    private static final long serialVersionUID = 11118718908L;
    private String id;
    private String contractNumber;
    private String poNumber;
    private Integer quantity;
    private Long beginAt;
    private Long endAt;
    private Long warrantyExpirationDate;
    private Long contractWarrantyExpirationDate;
    private String note;
}
