package com.ocena.qlsc.po.dto;

import jakarta.validation.constraints.Size;
import lombok.*;

import java.io.Serializable;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class PoRequest implements Serializable {
    @Size(min = 1, message = "Số hợp đồng không được để trống")
    private String contractNumber;
    @Size(min = 1, message = "Số PO không được để trống")
    private String poNumber;
    private Integer quantity;
    private Long beginAt;
    private Long endAt;
    private Long warrantyExpirationDate;
    private Long contractWarrantyExpirationDate;
    @Size(max = 400, message = "Ghi chú phải nhỏ hơn 400 ký tự")
    private String note;
    public PoRequest(String poNumber) {
        this.poNumber = poNumber;
    }
}
