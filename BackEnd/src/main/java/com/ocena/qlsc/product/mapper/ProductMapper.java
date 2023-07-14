package com.ocena.qlsc.product.mapper;

import com.ocena.qlsc.common.model.BaseMapper;
import com.ocena.qlsc.common.model.BaseMapperImpl;
import com.ocena.qlsc.product.dto.ProductDTO;
import com.ocena.qlsc.product.model.Product;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class ProductMapper extends BaseMapperImpl<Product, ProductDTO> {

    public ProductMapper(ModelMapper modelMapper) {
        super(modelMapper);
    }


    @Override
    protected Class<Product> getEntityClass() {
        return Product.class;
    }

    @Override
    protected Class<ProductDTO> getDtoClass() {
        return ProductDTO.class;
    }
}
