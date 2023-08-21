package com.ocena.qlsc.product.mapper;

import com.ocena.qlsc.common.model.BaseMapperImpl;
import com.ocena.qlsc.product.dto.product.ProductRequest;
import com.ocena.qlsc.product.dto.product.ProductResponse;
import com.ocena.qlsc.product.model.Product;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class ProductMapper extends BaseMapperImpl<Product, ProductRequest, ProductResponse> {
    public ProductMapper(ModelMapper modelMapper) {
        super(modelMapper);
    }
    @Override
    protected Class<Product> getEntityClass() {
        return Product.class;
    }
    @Override
    protected Class<ProductRequest> getRequestClass() {
        return ProductRequest.class;
    }
    @Override
    protected Class<ProductResponse> getResponseClass() {
        return ProductResponse.class;
    }

}
