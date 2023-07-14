package com.ocena.qlsc.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RoleDTO implements Serializable {

    @NotBlank(message = "RoleId is required")
    private String id;

    private String roleName;
}
