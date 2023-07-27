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
import com.ocena.qlsc.podetail.service.ProcessExcelFile;
import com.ocena.qlsc.podetail.status.ErrorType;
import com.ocena.qlsc.podetail.status.RegexConstants;
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
import java.util.stream.Collectors;


@Service
public class ProductService extends BaseServiceImpl<Product, ProductDTO> implements IProductService {

    @Autowired
    ProductRepository productRepository;

    @Autowired
    ProductMapper productMapper;

    @Autowired
    ProcessExcelFile processExcelFile;

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

    /**
     * Import products from an Excel file
     *
     * @param file File contains content to import
     * @return List Response Success or Fail
     */
    @Override
    @Transactional
    public ListResponse importProducts(MultipartFile file) {
        List<ErrorResponseImport> listError = new ArrayList<>();
        List<Product> listInsert = new ArrayList<>();

        //Check file Excel

        try(Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0); // Lấy sheet đầu tiên
            Iterator<Row> rowIterator = sheet.iterator();

            ErrorResponseImport errorResponse = processExcelFile.validateHeaderValue(rowIterator, RegexConstants.importProduct);
            if(errorResponse != null) {
                listError.add(errorResponse);
                return ResponseMapper.toListResponse(listError, 0, 0, StatusCode.DATA_NOT_MAP, StatusMessage.DATA_NOT_MAP);
            }

            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                int rowIndex = row.getRowNum() + 1;

                Object data = readExcelRowData(row, rowIndex);
                if (data instanceof ErrorResponseImport) {
                    ErrorResponseImport errorResponseImport = (ErrorResponseImport) data;
                    listError.add(errorResponseImport);
                } else {
                    Product product = (Product) data;
                    if (!productRepository.existsProductByProductId(product.getProductId()) &&
                            !listInsert.stream().anyMatch(products -> products.getProductId().equals(product.getProductId()))) {
                        listInsert.add(product);
                    } else {
                        listError.add(new ErrorResponseImport(ErrorType.RECORD_EXISTED, rowIndex,
                                "Mã hàng hóa " + product.getProductId() + " đã tồn tại"));
                    }
                }
            }
            productRepository.saveAll(listInsert);
            listError.add(0, new ErrorResponseImport(ErrorType.DATA_SUCCESS, listInsert.size() + " hàng Insert thành công"));
        } catch (Exception ex) {
            listError.add(new ErrorResponseImport(ErrorType.FILE_NOT_FORMAT, "File không đúng định dạng"));
            return ResponseMapper.toListResponse(listError, 0, 0, StatusCode.DATA_NOT_MAP, StatusMessage.DATA_NOT_MAP);
        }

        return ResponseMapper.toListResponseSuccess(listError);
    }

    /**
     * Read Row data from an Excel file
     *
     * @param row
     * @param rowIndex
     * @return The data is converted to either Product Entity or ErrorResponse
     */
    public Object readExcelRowData(Row row, int rowIndex) {
        ErrorResponseImport errorResponseImport = (ErrorResponseImport)
                processExcelFile.validateTextColumns(row, rowIndex, 0);

        if (errorResponseImport != null) {
            return errorResponseImport;
        }

        //Get Data and Create Object
        String productId = row.getCell(0).getStringCellValue();
        String productName = row.getCell(1).getStringCellValue();
        ProductDTO productDTO = new ProductDTO(productId.trim(), productName.trim());

        //Validate DTO
        List<String> resultError = validationRequest(productDTO);

        if(resultError == null) {
            return getBaseMapper().dtoToEntity(productDTO);
        } else {
            return new ErrorResponseImport(ErrorType.DATA_NOT_MAP, rowIndex, resultError.get(0));
        }
    }
}
