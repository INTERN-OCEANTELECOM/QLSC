package com.ocena.qlsc.product.controller;

import com.ocena.qlsc.common.controller.BaseApiImpl;
import com.ocena.qlsc.common.dto.SearchKeywordDto;
import com.ocena.qlsc.common.response.DataResponse;
import com.ocena.qlsc.common.response.ListResponse;
import com.ocena.qlsc.common.service.BaseService;
import com.ocena.qlsc.common.response.ErrorResponseImport;
import com.ocena.qlsc.product.model.Product;
import com.ocena.qlsc.product.dto.ProductDTO;
import com.ocena.qlsc.product.service.ProductService;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping(value = "/product")
//@CrossOrigin(value = "*")
public class ProductController extends BaseApiImpl<Product, ProductDTO> {

    @Autowired
    ProductService productService;

    @Override
    protected BaseService<Product, ProductDTO> getBaseService() {
        return productService;
    }

    @Override
    @CacheEvict(value = {"getProducts", "findAllProduct"}, allEntries = true)
    public DataResponse<ProductDTO> add(@Valid ProductDTO objectDTO) {
        return super.add(objectDTO);
    }

    @Override
    public ListResponse<ProductDTO> getAll() {
        return super.getAll();
    }

    @Override
    @Cacheable(value = "getProducts")
    public ListResponse<ProductDTO> getAllByPage(int page, int size) {
        return super.getAllByPage(page, size);
    }

    @Override
    public ListResponse<Product> searchByKeyword(SearchKeywordDto searchKeywordDto) {
        return super.searchByKeyword(searchKeywordDto);
    }

    @Override
    @CacheEvict(value = {"getProducts", "findAllProduct"}, allEntries = true)
    public DataResponse<ProductDTO> update(@Valid ProductDTO objectDTO, String key) {
        return super.update(objectDTO, key);
    }


//    @Parameter(in = ParameterIn.HEADER, name = "email", description = "Email Header")
//    @GetMapping("/po")
//    public ListResponse<ProductDTO> getProductsByPo(@RequestParam("Po") String Po) {
//        return productService.getProductsByPO(Po);
//    }

    /* Use For Swagger*/
    @Hidden
    @Override
    public DataResponse<ProductDTO> getById(String id) {
        return null;
    }
    @Hidden
    @Override
    public DataResponse<ProductDTO> delete(String id) {
        return null;
    }
    @Hidden
    @Override
    public ListResponse<ProductDTO> getByIds(String ids) {
        return null;
    }
    @Hidden
    @Override
    public ListResponse<Product> getAllByKeyword(String keyword) {
        return null;
    }
}
