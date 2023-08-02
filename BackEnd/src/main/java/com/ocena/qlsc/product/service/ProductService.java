package com.ocena.qlsc.product.service;

import com.ocena.qlsc.common.dto.SearchKeywordDto;
import com.ocena.qlsc.common.message.StatusCode;
import com.ocena.qlsc.common.message.StatusMessage;
import com.ocena.qlsc.common.model.BaseMapper;
import com.ocena.qlsc.common.repository.BaseRepository;
import com.ocena.qlsc.common.response.ListResponse;
import com.ocena.qlsc.common.response.ResponseMapper;
import com.ocena.qlsc.common.service.BaseServiceImpl;
import com.ocena.qlsc.common.response.ErrorResponseImport;
import com.ocena.qlsc.podetail.utils.FileExcelUtil;
import com.ocena.qlsc.podetail.constants.ImportErrorType;
import com.ocena.qlsc.podetail.constants.RegexConstants;
import com.ocena.qlsc.product.dto.ProductDTO;
import com.ocena.qlsc.product.mapper.ProductMapper;
import com.ocena.qlsc.product.model.Product;
import com.ocena.qlsc.product.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;


@Service
public class ProductService extends BaseServiceImpl<Product, ProductDTO> implements IProductService {

    @Autowired
    ProductRepository productRepository;

    @Autowired
    ProductMapper productMapper;

    @Autowired
    FileExcelUtil processExcelFile;

    @Autowired
    ModelMapper mapper;

    @Override
    protected BaseRepository<Product> getBaseRepository() {
        return productRepository;
    }

    @Override
    protected BaseMapper<Product, ProductDTO> getBaseMapper() {
        return productMapper;
    }

    @Override
    protected Function<String, Optional<Product>> getFindByFunction() {
        return productRepository::findByProductId;
    }

    @Override
    protected Class<Product> getEntityClass() {
        return Product.class;
    }

    /**
     * get Product By Page
     *
     * @param searchKeywordDto receives the keywords and property used for searching
     * @param pageable receives the page to be returned
     * @return a page of products according to the keywords
     */
    @Override
    protected Page<Product> getPageResults(SearchKeywordDto searchKeywordDto, Pageable pageable) {
        String propertySearch = searchKeywordDto.getProperty();

        if (propertySearch.equals("productId")){
            return productRepository.searchProduct(searchKeywordDto.getKeyword().get(0), null, pageable);
        } else if (propertySearch.equals("productName")){
            return productRepository.searchProduct(null, searchKeywordDto.getKeyword().get(0), pageable);
        }

        return productRepository.searchProduct(searchKeywordDto.getKeyword().get(0), searchKeywordDto.getKeyword().get(0), pageable);
    }

    @Override
    protected List<Product> getListSearchResults(String keyword) {
        return null;
    }
}
