package com.ocena.qlsc.po.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PoDTO implements Serializable {

    @Size(min = 1, message = "ContractNumber không được để trống")
    private String contractNumber;
    @Size(min = 1, message = "PoNumber không được để trống")
    private String poNumber;

//    @NotNull(message = "quantity must not be null")
//    @Min(value = 1, message = "quantity must be greater than 0")
    private Integer quantity;

//    @NotNull(message = "beginAt must not be null")
//    @Min(value = 1, message = "beginAt must be greater than 0")
    private Long beginAt;

//    @NotNull(message = "endAt must not be null")
//    @Min(value = 1, message = "endAt must be greater than 0")
    private Long endAt;

    private Long warrantyExpirationDate;

    private Long contractWarrantyExpirationDate;

    @Size(max = 400, message = "Ghi chú phải nhỏ hơn 400 ký tự")
    private String note;

    public PoDTO(String poNumber) {
        this.poNumber = poNumber;
    }
}
