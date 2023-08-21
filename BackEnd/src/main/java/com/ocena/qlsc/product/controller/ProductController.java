package com.ocena.qlsc.product.controller;

import com.ocena.qlsc.common.annotation.ApiShow;
import com.ocena.qlsc.common.controller.BaseApiImpl;
import com.ocena.qlsc.common.dto.SearchKeywordDto;
import com.ocena.qlsc.common.response.DataResponse;
import com.ocena.qlsc.common.response.ListResponse;
import com.ocena.qlsc.common.service.BaseService;
import com.ocena.qlsc.product.dto.product.ProductRequest;
import com.ocena.qlsc.product.dto.product.ProductResponse;
import com.ocena.qlsc.product.model.Product;
import com.ocena.qlsc.product.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping(value = "/product")
public class ProductController extends BaseApiImpl<Product, ProductRequest, ProductResponse> {
    @Autowired
    ProductService productService;
    @Override
    protected BaseService<Product, ProductRequest, ProductResponse> getBaseService() {
        return productService;
    }

    @ApiShow
    @CacheEvict(value = {"findAllProduct"}, allEntries = true)
    @Override
    public DataResponse<ProductResponse> add(ProductRequest productRequest) {
        return productService.createProduct(productRequest);
    }

    @Override
    @ApiShow
    @Operation(summary = """
                            Update product information and images.
                            Return an error if the product doesn't exist or the images are wrong.
                            Return "Success" if it's successful.
                        """)
    @CacheEvict(value = {"findAllProduct"}, allEntries = true)
    public DataResponse<ProductResponse> update(@Valid ProductRequest productRequest,
                                                String key) {
        return productService.updateProduct(productRequest, key);
    }

    @Override
    @ApiShow
    public ListResponse<ProductResponse> getAll() {
        return productService.getAllProduct();
    }
    @ApiShow
    @GetMapping("/get-by-pages")
    public ListResponse<ProductResponse> getProductByPage(@Param("page") int page, @Param("size") int size) {
        return productService.getPagedProducts(page, size);
    }

    @Override
    @ApiShow
    public DataResponse<ProductResponse> getById(String id) {
        return super.getById(id);
    }

    @Override
    @ApiShow
    public ListResponse<ProductResponse> searchByKeyword(SearchKeywordDto searchKeywordDto) {
        return super.searchByKeyword(searchKeywordDto);
    }

    @ApiShow
    @GetMapping("/get-all-product-name")
    public ListResponse<List<String>> getAllProductName() {
        return productService.getAllProductName();
    }

}
