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
import com.ocena.qlsc.podetail.model.PoDetail;
import com.ocena.qlsc.podetail.utils.FileExcelUtil;
import com.ocena.qlsc.podetail.constants.ImportErrorType;
import com.ocena.qlsc.podetail.constants.RegexConstants;
import com.ocena.qlsc.product.dto.ProductDTO;
import com.ocena.qlsc.product.dto.ProductResponse;
import com.ocena.qlsc.product.mapper.ProductMapper;
import com.ocena.qlsc.product.model.Product;
import com.ocena.qlsc.product.repository.ProductRepository;
import com.ocena.qlsc.user_history.mapper.HistoryMapper;
import jakarta.transaction.Transactional;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;


@Service
public class ProductService extends BaseServiceImpl<Product, ProductDTO> implements IProductService {

    @Autowired
    ProductRepository productRepository;

    @Autowired
    ProductMapper productMapper;

    @Autowired
    FileExcelUtil processExcelFile;

    @Autowired
    HistoryMapper mapper;

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
        List<String> listKeywords = searchKeywordDto.getKeyword().get(0) != null ?
                Arrays.asList(searchKeywordDto.getKeyword().get(0).split("\\s+")) : new ArrayList<>();
        try {
            //Check if the first element of the list is of type Long
            Long.parseLong(listKeywords.get(0));

            List<Product> productList = productRepository.findAll();
            List<Product> mergeList = productList.stream()
                    .filter(product -> listKeywords.stream().anyMatch(keyword -> product.getProductId().contains(keyword)))
                    .collect(Collectors.toList());

            //Create Page with Start End
            List<Product> pageProducts = mergeList
                    .subList(pageable.getPageNumber() * pageable.getPageSize(),
                            Math.min(pageable.getPageNumber() * pageable.getPageSize() + pageable.getPageSize(), mergeList.size()));
            return new PageImpl<>(pageProducts, pageable, mergeList.size());
        }catch (NumberFormatException e ){
            return productRepository.searchProduct(searchKeywordDto.getKeyword().get(0), pageable);
        }
    }

    @Override
    protected List<Product> getListSearchResults(String keyword) {
        return null;
    }

    public ListResponse<ProductResponse> getProductByPage(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Object[]> resultPage = productRepository.getProductPageable(pageable);
        Page<ProductResponse> productResponsePage = resultPage.map(objects -> ProductResponse.builder()
                .productId(objects[0].toString())
                .productName(objects[1].toString())
                .amount(Integer.valueOf(objects[2].toString()))
                .build());

        return ResponseMapper.toPagingResponseSuccess(productResponsePage);
    }
}
