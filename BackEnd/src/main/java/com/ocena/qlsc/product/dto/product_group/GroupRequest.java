package com.ocena.qlsc.product.dto.product_group;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class GroupRequest {
    @NotNull(message = "Group Id is required")
    @NotBlank(message = "Group Id is required")
    private String id;
}
