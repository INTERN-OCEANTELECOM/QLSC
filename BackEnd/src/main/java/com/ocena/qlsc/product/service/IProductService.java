package com.ocena.qlsc.product.service;

import com.ocena.qlsc.common.response.ListResponse;
import com.ocena.qlsc.common.service.BaseService;
import com.ocena.qlsc.product.dto.ProductDTO;
import com.ocena.qlsc.product.model.Product;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

public interface IProductService extends BaseService<Product, ProductDTO>{
}
