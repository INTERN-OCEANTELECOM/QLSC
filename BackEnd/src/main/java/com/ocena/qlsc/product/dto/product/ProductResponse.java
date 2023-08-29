package com.ocena.qlsc.product.dto.product;

import com.ocena.qlsc.product.dto.image.ProductImageDto;
import com.ocena.qlsc.product.dto.product_group.GroupResponse;
import lombok.*;

import java.io.Serial;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {
    private String id;
    private String productId;
    private String productName;
    private Integer amount;
    private GroupResponse productGroup;
    private List<ProductImageDto> images;
}
