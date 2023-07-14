package com.ocena.qlsc.po.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PoDTO implements Serializable {

    @NotBlank(message = "ContractNumber must not be blank")
    private String contractNumber;
    @NotBlank(message = "poNumber must not be blank")
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

    public PoDTO(String poNumber) {
        this.poNumber = poNumber;
    }
}
