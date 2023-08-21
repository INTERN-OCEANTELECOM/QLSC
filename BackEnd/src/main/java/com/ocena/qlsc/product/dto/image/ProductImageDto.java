package com.ocena.qlsc.product.dto.image;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductImageDto implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    private byte[] fileBytes;
}
