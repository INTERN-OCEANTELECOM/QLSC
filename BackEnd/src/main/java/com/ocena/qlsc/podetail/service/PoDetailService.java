package com.ocena.qlsc.podetail.service;

import com.ocena.qlsc.common.error.exception.DataAlreadyExistException;
import com.ocena.qlsc.common.error.exception.InvalidHeaderException;
import com.ocena.qlsc.common.error.exception.NotPermissionException;
import com.ocena.qlsc.common.error.exception.ResourceNotFoundException;
import com.ocena.qlsc.common.service.BaseServiceAdapter;
import com.ocena.qlsc.common.util.CacheUtils;
import com.ocena.qlsc.common.util.ReflectionUtils;
import com.ocena.qlsc.common.util.StringUtils;
import com.ocena.qlsc.po.dto.PoRequest;
import com.ocena.qlsc.podetail.dto.PoDetailRequest;
import com.ocena.qlsc.podetail.dto.PoDetailResponse;
import com.ocena.qlsc.podetail.utils.FileExcelUtil;
import com.ocena.qlsc.product.dto.product.ProductRequest;
import com.ocena.qlsc.product.model.Product;
import com.ocena.qlsc.user.model.RoleUser;
import com.ocena.qlsc.common.dto.SearchKeywordDto;
import com.ocena.qlsc.common.constants.message.StatusCode;
import com.ocena.qlsc.common.constants.message.StatusMessage;
import com.ocena.qlsc.common.model.BaseMapper;
import com.ocena.qlsc.common.repository.BaseRepository;
import com.ocena.qlsc.common.response.DataResponse;
import com.ocena.qlsc.common.response.ListResponse;
import com.ocena.qlsc.common.response.ResponseMapper;
import com.ocena.qlsc.common.util.SystemUtils;
import com.ocena.qlsc.po.model.Po;
import com.ocena.qlsc.po.repository.PoRepository;
import com.ocena.qlsc.podetail.model.PoDetail;
import com.ocena.qlsc.podetail.mapper.PoDetailMapper;
import com.ocena.qlsc.podetail.repository.PoDetailRepository;
import com.ocena.qlsc.podetail.constants.ImportErrorType;
import com.ocena.qlsc.common.response.ErrorResponseImport;
import com.ocena.qlsc.podetail.constants.RegexConstants;
import com.ocena.qlsc.product.repository.ProductRepository;
import com.ocena.qlsc.user.model.Role;
import com.ocena.qlsc.user.repository.RoleRepository;
import com.ocena.qlsc.user_history.enumrate.Action;
import com.ocena.qlsc.user_history.service.HistoryService;
import org.apache.log4j.Logger;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;
import org.apache.poi.ss.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class PoDetailService extends BaseServiceAdapter<PoDetail, PoDetailRequest, PoDetailResponse> implements IPoDetailService {
    @Autowired
    PoDetailMapper poDetailMapper;
    @Autowired
    PoDetailRepository poDetailRepository;
    @Autowired
    ProductRepository productRepository;
    @Autowired
    PoRepository poRepository;
    @Autowired
    RoleRepository roleRepository;
    @Autowired
    HistoryService historyService;
    @Autowired
    CacheUtils cacheUtils;

    @Override
    protected BaseRepository<PoDetail> getBaseRepository() {
        return poDetailRepository;
    }

    @Override
    protected BaseMapper<PoDetail, PoDetailRequest, PoDetailResponse> getBaseMapper() {
        return poDetailMapper;
    }

    @Override
    protected Function<String, Optional<PoDetail>> getFindByFunction() {
        return poDetailRepository::findByPoDetailId;
    }

    @Override
    protected Class<PoDetail> getEntityClass() {
        return PoDetail.class;
    }

    @Override
    public Logger getLogger() {
        return super.getLogger();
    }

    @Override
    protected Page<PoDetailResponse> getPageResults(SearchKeywordDto searchKeywordDto, Pageable pageable) {
        List<String> listProductIds = StringUtils.splitWhiteSpaceToList(searchKeywordDto.getKeyword().get(0));
        List<String> listSerialNumbers = StringUtils.splitWhiteSpaceToList(searchKeywordDto.getKeyword().get(1));
        List<String> listPoNumbers = StringUtils.splitWhiteSpaceToList(searchKeywordDto.getKeyword().get(2));

        if (!listSerialNumbers.isEmpty() || !listProductIds.isEmpty() || !listPoNumbers.isEmpty()) {
            pageable = PageRequest.of(0, Integer.MAX_VALUE);
        }

        Page<PoDetail> pageSearchPoDetails = poDetailRepository.searchPoDetail(
                searchKeywordDto.getKeyword().get(3),
                searchKeywordDto.getKeyword().get(4),
                searchKeywordDto.getKeyword().get(5),
                searchKeywordDto.getKeyword().get(6),
                searchKeywordDto.getKeyword().get(7),
                searchKeywordDto.getKeyword().get(8),
                searchKeywordDto.getKeyword().get(9), pageable);

        if (listSerialNumbers.isEmpty() && listProductIds.isEmpty() && listPoNumbers.isEmpty()) {
            return pageSearchPoDetails.map(poDetail -> poDetailMapper.entityToDto(poDetail));
        }

        List<PoDetail> mergeList = pageSearchPoDetails.getContent().stream()
                .filter(poDetail -> (listProductIds.isEmpty() || listProductIds.contains(poDetail.getProduct().getProductId()))
                        && (listSerialNumbers.isEmpty() || listSerialNumbers.contains(poDetail.getSerialNumber()))
                        && (listPoNumbers.isEmpty() || listPoNumbers.contains(poDetail.getPo().getPoNumber())))
                .collect(Collectors.toList());

        getLogger().info(mergeList.size());

        return new PageImpl<>(mergeList, pageable, mergeList.size())
                .map(poDetail -> poDetailMapper.entityToDto(poDetail));
    }

    public ListResponse<PoDetailResponse> getByPO(String poNumber) {
        if (poNumber.equals("getAll")) {
            return ResponseMapper.toListResponseSuccess(
                    poDetailRepository.findAll()
                            .stream().map(poDetail -> getBaseMapper().entityToDto(poDetail)).collect(Collectors.toList()));
        }
        return ResponseMapper.toListResponseSuccess(
                poDetailRepository.findByPoNumber(poNumber)
                        .stream().map(poDetail -> getBaseMapper().entityToDto(poDetail)).collect(Collectors.toList()));
    }

    public Object setDataFromDTO(PoDetailRequest poDetailDto, int rowIndex, List<String> fields) {
        Optional<PoDetail> optionalPoDetail = poDetailRepository.findByPoDetailId(poDetailDto.getPoDetailId());
        // If the PO Detail does not exist, add an error to the list of errors and continue to the next row
        if (optionalPoDetail.isEmpty()) {
            return new ErrorResponseImport(ImportErrorType.DATA_NOT_FOUND,
                    rowIndex, poDetailDto.getPoDetailId() + " không tồn tại");
        }
        PoDetail poDetail = optionalPoDetail.get();
        try {
            for (String field: fields) {
                if(RegexConstants.REQUIRED_FIELDS.stream().anyMatch(value -> value.equals(field)) ||
                        field.equals(RegexConstants.UNREQUIRED_FIELDS.get(0)))
                     continue;
                Method method = ReflectionUtils.setterMethod(PoDetail.class, field, ReflectionUtils.getFieldType(field, new PoDetail()));
                method.invoke(poDetail, ReflectionUtils.getFieldValueByReflection(field, poDetailDto));
            }
        } catch (IllegalAccessException | InvocationTargetException e) {
            throw new RuntimeException(e);
        }
        return poDetail;

    }

    /**
     * Processes an Excel file containing information about PO Details and updates their information in the database.
     *
     * @param file      the Excel file to process
     * @return a ListResponse containing a list of errors if any errors occurred during processing, or a list of updated PO Details if no errors occurred
     * @throws NoSuchMethodException     if a specified method does not exist
     * @throws NoSuchFieldException      if a specified field does not exist
     * @throws IllegalAccessException    if access to a specified field is denied
     * @throws InvocationTargetException if a specified method cannot be invoked
     */
    @SuppressWarnings("unchecked")
    public ListResponse<?> updatePoDetailFromExcel(MultipartFile file) throws NoSuchMethodException, NoSuchFieldException, IllegalAccessException, InvocationTargetException {
        LinkedList<ErrorResponseImport> listErrorResponse = new LinkedList<>();
        List<PoDetail> listUpdatePoDetail = new ArrayList<>();

        // Process the Excel file
        Object dataFile = FileExcelUtil.getSheetIteratorFromExcelFile(file);
        //  If the Excel file could not be processed, return an error response
        if (dataFile instanceof ListResponse) {
            return (ListResponse) dataFile;
        }
        Iterator<Row> rowIterator = (Iterator<Row>) dataFile;

        // Validate the header row
        Object dataInHeader = FileExcelUtil.getFieldsNameFromHeader(rowIterator);
        if(dataInHeader instanceof ErrorResponseImport) {
            listErrorResponse.add((ErrorResponseImport) dataInHeader);
            throw new InvalidHeaderException(listErrorResponse);
        }
        List<String> fields = (List<String>) dataInHeader;

        if (!hasImportPoDetailPermission(fields)) {
            throw new NotPermissionException();
        }

        // Read each row in the sheet and update the corresponding PO Detail in the database
        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();
            if(FileExcelUtil.isLastedRow(row)) {
                break;
            }
            int rowIndex = row.getRowNum() + 1;

            // Read the data from the row
            Object data = readDataFromRow(row, rowIndex, fields);


            // If there is an error, add it to the list of errors; otherwise, update the corresponding PO Detail
            if (data instanceof ErrorResponseImport) {
                ErrorResponseImport errorResponseImport = (ErrorResponseImport) data;
                listErrorResponse.add(errorResponseImport);
            } else {
                PoDetailRequest poDetailDto = (PoDetailRequest) data;

                if(listUpdatePoDetail.stream()
                        .anyMatch(poDetail -> poDetail.getPoDetailId().equals(poDetailDto.getPoDetailId()))) {
                    listErrorResponse.add(new ErrorResponseImport(ImportErrorType.RECORD_EXISTED,
                            rowIndex, poDetailDto.getPoDetailId() + " bị trùng"));
                    continue;
                }
                Object value = setDataFromDTO(poDetailDto, rowIndex, fields);
                if(value instanceof ErrorResponseImport) {
                    listErrorResponse.add((ErrorResponseImport) value);
                } else {
                    listUpdatePoDetail.add((PoDetail) value);
                }
            }
        }

        if (listErrorResponse.isEmpty() && listUpdatePoDetail.size() > 0) {
            List<PoDetail> resultList = poDetailRepository.saveAll(listUpdatePoDetail);
            historyService.importExcelHistory(Action.UPDATE.getValue(), listUpdatePoDetail, file);
            return ResponseMapper.toListResponseSuccess(resultList
                    .stream()
                    .map(value -> poDetailMapper.entityToDto(value))
                    .collect(Collectors.toList()));
        }
        return ResponseMapper.toListResponse(listErrorResponse, listErrorResponse.size(), 1, StatusCode.DATA_NOT_MAP, StatusMessage.DATA_NOT_MAP);
    }

    public ListResponse<?> searchBySerialNumbers(MultipartFile file) {
        LinkedList<ErrorResponseImport> listError = new LinkedList<>();
        Object dataFile = FileExcelUtil.getSheetIteratorFromExcelFile(file);
        if(dataFile instanceof ListResponse<?>) {
            return (ListResponse) dataFile;
        }
        // Get an iterator over the rows in the Excel file
        Iterator<Row> rowIterator = (Iterator<Row>) dataFile;
        // Validate header value
        ErrorResponseImport errorResponseImport = FileExcelUtil.validateHeaderValue(rowIterator, RegexConstants.SEARCH_SERIAL_NUMBER);
        if(errorResponseImport != null) {
            listError.add(errorResponseImport);
            throw new InvalidHeaderException(listError);
        }

        List<String> listSearchSerialNumber = new ArrayList<>();
        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();
            int rowIndex = row.getRowNum() + 1;

            if (row.getCell(0).getCellType() == CellType.BLANK) {
                // Stop reading data when an empty line is encountered
                listError.add(new ErrorResponseImport(ImportErrorType.DATA_NOT_MAP, rowIndex, "Dữ liệu không được để trống"));
                continue;
            }
            String serialNumber = FileExcelUtil.getCellValueToString(row, 0);
            if(serialNumber.contains(" ")) {
                listError.add(new ErrorResponseImport(ImportErrorType.DATA_NOT_MAP, rowIndex, "S/N chứa khoảng trắng"));
                continue;
            }

            listSearchSerialNumber.add(serialNumber);
        }
        if(!listError.isEmpty()) {
            return ResponseMapper.toListResponse(listError, 0, 0, StatusCode.DATA_NOT_MAP, StatusMessage.DATA_NOT_MAP);
        }
        List<PoDetail> listResults = poDetailRepository.findBySerialNumberIn(listSearchSerialNumber);
        return ResponseMapper.toListResponseSuccess(listResults.stream()
                .map(value -> getBaseMapper().entityToDto(value))
                .collect(Collectors.toList()));
    }

    private Object validateDataImport(PoDetailRequest poDetailDto, List<PoDetail> listInsert, Integer rowIndex) {
        // Check if the product in the row exists in the database
        Product product = productRepository.findAll().stream()
                .filter(p -> p.getProductId().equals(poDetailDto.getProduct().getProductId()))
                .findFirst()
                .orElse(null);

        System.out.println(product);

        PoDetail poDetail = getBaseMapper().dtoToEntity(poDetailDto);

        if (product != null) {
            // If the product exists, continue processing the row
            Optional<Po> optionalPo = poRepository.findByPoNumber(poDetailDto.getPo().getPoNumber());
            // // If the PO detail already exists in the database or has already been added to the list of PO details to be inserted, add an error
            Optional<PoDetail> optionalPoDetail = poDetailRepository.findByPoDetailId(poDetailDto.getPoDetailId());
            if (optionalPoDetail.isPresent() || listInsert.stream()
                    .anyMatch(value -> value.getPoDetailId().equals(poDetailDto.getPoDetailId()))) {
                return new ErrorResponseImport(ImportErrorType.RECORD_EXISTED,
                        rowIndex, poDetailDto.getPoDetailId() + " đã tồn tại nên không thể import");
            }
            if (optionalPo.isEmpty()) {
                // If the PO for the PO detail does not exist in the database, add an error
                return new ErrorResponseImport(ImportErrorType.DATA_NOT_FOUND,
                        rowIndex, poDetailDto.getPoDetailId() + " có PO không tồn tại");
            }

            // If the number of PO details for the PO has reached the PO quantity, add an error
            // and stop processing the file
            Integer quantity = optionalPo.get().getQuantity();
            Long countPoDetailByPoNumber = poRepository.countByPoNumber(poDetailDto.getPo().getPoNumber());
            if (countPoDetailByPoNumber + listInsert.size() > quantity) {
                return new ErrorResponseImport(poDetailDto.getPo().getPoNumber(),
                        ImportErrorType.EXCEEDED_QUANTITY);
            }

            poDetail.setPo(optionalPo.get());
            poDetail.setProduct(product);
        } else {
            return new ErrorResponseImport(ImportErrorType.DATA_NOT_FOUND,
                    rowIndex, poDetailDto.getPoDetailId() + " có Mã Hàng Hóa không tồn tại");
        }

        return poDetail;
    }

    /**
     * Imports PO detail data from an Excel file and saves it to the database.
     *
     * @param file the Excel file containing the PO detail data
     * @return a list of ErrorResponseImport objects representing any errors that occurred during the import process
     * @throws IOException
     */
    @Transactional
    @SuppressWarnings("unchecked")
    public ListResponse<?> importPODetailFromExcel(MultipartFile file) {
        LinkedList<ErrorResponseImport> listErrorResponse = new LinkedList<>();
        List<PoDetail> listInsertPoDetail = new ArrayList<>();

        // Process the Excel file
        Object dataFile = FileExcelUtil.getSheetIteratorFromExcelFile(file);
        // If the Excel file could not be processed, return an error response
        if (dataFile instanceof ListResponse) {
            return (ListResponse) dataFile;
        }

        // Get an iterator over the rows in the Excel file
        Iterator<Row> rowIterator = (Iterator<Row>) dataFile;

        // Validate header value
        ErrorResponseImport errorResponse;
        Object dataInHeader = FileExcelUtil.getFieldsNameFromHeader(rowIterator);
        List<String> fieldsImport = (List<String>) dataInHeader;

        // Read each row in the Excel file and save the data to the database
        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();
            int rowIndex = row.getRowNum() + 1;

            if(FileExcelUtil.isLastedRow(row)) {
                break;
            }

            // Read the data from the row
            Object data = readDataFromRow(row, rowIndex, fieldsImport);

            // If there was an error reading the row, add it to the list of errors
            if (data instanceof ErrorResponseImport) {
                errorResponse = (ErrorResponseImport) data;
                listErrorResponse.add(errorResponse);
            } else {
                // If the row was read successfully, process the data
                PoDetailRequest poDetailDto = (PoDetailRequest) data;

                // Validate poDetail
                Object object = validateDataImport(poDetailDto, listInsertPoDetail, rowIndex);
                if(!(object instanceof PoDetail)) {
                    errorResponse = (ErrorResponseImport) object;
                    listErrorResponse.add(errorResponse);
                    if (errorResponse.getErrorDescription().equals(ImportErrorType.EXCEEDED_QUANTITY))
                        break;
                    continue;
                }
                // If the PO detail is valid, convert it to an entity and add it to the list of PO details to be inserted
                PoDetail poDetail = (PoDetail) object;
                System.out.println(poDetail);
                listInsertPoDetail.add(poDetail);
            }
        }

        // Clear Cache
        cacheUtils.clearCache("countByPoNumber");

        if (listErrorResponse.isEmpty() && listInsertPoDetail.size() > 0) {
            List<PoDetail> resultList = poDetailRepository.saveAll(listInsertPoDetail);
            historyService.importExcelHistory(Action.IMPORT.getValue(), listInsertPoDetail, file);
            return ResponseMapper.toListResponseSuccess(resultList
                    .stream()
                    .map(value -> poDetailMapper.entityToDto(value))
                    .collect(Collectors.toList()));
        }
        return ResponseMapper.toListResponse(listErrorResponse, listErrorResponse.size(), 1, StatusCode.DATA_NOT_MAP, StatusMessage.DATA_NOT_MAP);
    }

    /**
     * Reads data from a row in an Excel file and returns an object representing the data.
     * @param row      the row in the Excel file to read data from
     * @param rowIndex the index of the row in the Excel file
     * @return an object representing the data from the row, or an ErrorResponseImport object if there is an error
     */
    public Object readDataFromRow(Row row, int rowIndex, List<String> fieldsImport) {
        PoDetailRequest poDetailDto = new PoDetailRequest();
        int colIndex = 0;
        for(String field: fieldsImport) {
            if(fieldsImport.get(colIndex).equals("productName")) {
                colIndex++;
                continue;
            }

            Object value = RegexConstants.functionGetDataFromCellExcel.get(field).apply(row, colIndex);
            colIndex++;
            if(field.equals("productId")) {
                poDetailDto.setProduct(new ProductRequest((String) value));
                continue;
            }

            if(field.equals("poNumber")) {
                poDetailDto.setPo(new PoRequest((String) value));
                continue;
            }

            try {
                if(value instanceof Long) {
                    Method method = ReflectionUtils.setterMethod(PoDetailRequest.class, field, Long.class);
                    method.invoke(poDetailDto, value);
                } else if(value instanceof String) {
                    Method method = ReflectionUtils.setterMethod(PoDetailRequest.class, field, String.class);
                    method.invoke(poDetailDto, value);
                } else if(value instanceof Short) {
                    Method method = ReflectionUtils.setterMethod(PoDetailRequest.class, field, Short.class);
                    method.invoke(poDetailDto, value);
                }
            } catch (IllegalAccessException | InvocationTargetException e) {
                throw new RuntimeException(e);
            }
        }


        String poDetailId = poDetailDto.getPo().getPoNumber() + "-" + poDetailDto.getProduct().getProductId() + "-"
                + poDetailDto.getSerialNumber();
        poDetailDto.setPoDetailId(poDetailId);
        System.out.println(poDetailDto);

        // Validate the PO detail object and return it if it is valid
        List<String> resultError = validationRequest(poDetailDto);
        if (resultError == null) {
            return poDetailDto;
        } else {
            // If the PO detail object is invalid, return an ErrorResponseImport object with an error message
            return new ErrorResponseImport(ImportErrorType.DATA_NOT_MAP, rowIndex, resultError.get(0));
        }
    }


    public DataResponse<String> deletePoDetail(String id) {
        try {
            PoDetail poDetail = poDetailRepository.findByPoDetailId(id).get();
            if(poDetail.getRepairHistories().size() > 0) {
                throw new DataAlreadyExistException("Repair history already exist");
            }
            poDetailRepository.delete(poDetail);
            /* Save History */
            historyService.deleteHistory(getEntityClass(), id);
            return ResponseMapper.toDataResponseSuccess("Success");
        } catch (NoSuchElementException e) {
            throw new ResourceNotFoundException(id + " doesn't exist");
        }
    }

    public Boolean hasImportPoDetailPermission(List<String> fieldList) {
        String email = SystemUtils.getCurrentEmail();
        List<Role> userRoles = roleRepository.getRoleByEmail(email);
        List<String> updateableFieldsForKCSRole = new ArrayList<>(Arrays.asList("productId", "serialNumber", "poNumber","kcsVT"));
        List<String> updateableFieldsForRepairRole = new ArrayList<>(Arrays.asList("productId", "serialNumber", "poNumber","repairStatus"));

        for (Role role : userRoles) {
            if ((role.getRoleName().equals(RoleUser.ROLE_ADMIN.name()) || role.getRoleName().equals(RoleUser.ROLE_QLPO.name()) || role.getRoleName().equals(RoleUser.ROLE_MANAGER.name()))
                    || (role.getRoleName().equals(RoleUser.ROLE_KCSANALYST.name()) && fieldList.containsAll(updateableFieldsForKCSRole)
                    || (role.getRoleName().equals(RoleUser.ROLE_QLSC.name()) && fieldList.containsAll(updateableFieldsForRepairRole)))){
                return true;
            }
        }
        return false;
    }

    public ListResponse<PoDetailResponse> getBySerialNumber(String serialNumber){
        List<PoDetail> poDetails = poDetailRepository.getPoDetailsBySerialNumber(serialNumber);

        List<PoDetailResponse> poDetailResponses = poDetails
                .stream()
                .map(poDetail -> poDetailMapper.entityToDto(poDetail))
                .collect(Collectors.toList());

        return ResponseMapper.toListResponseSuccess(poDetailResponses);
    }

    public ListResponse<PoDetailResponse> getAllByListKeyword(SearchKeywordDto searchKeywordDto){
        Page<PoDetailResponse> poDetailPage = getPageResults(searchKeywordDto, PageRequest.of(0, Integer.MAX_VALUE));
        return ResponseMapper.toListResponseSuccess(poDetailPage.getContent());
    }

    public DataResponse<String> updateImageDates(String poDetailIds) {
        List<String> listPoDetailIds = StringUtils.splitWhiteSpaceToList(poDetailIds);

        if(listPoDetailIds.isEmpty()) {
            return ResponseMapper.toDataResponseSuccess(null);
        }

        List<PoDetail> poDetailList = poDetailRepository.getPoDetailsByPoDetailIdIn(listPoDetailIds);

        poDetailList.stream()
                .forEach(poDetail -> poDetail.setImportDate(System.currentTimeMillis()));
        int updateCount = poDetailRepository.saveAll(poDetailList).size();

        return ResponseMapper.toDataResponseSuccess(updateCount + " hàng hóa cập nhật");
    }

    public DataResponse<String> updateExportPartners(String poDetailIds) {
        List<String> listPoDetailIds = StringUtils.splitWhiteSpaceToList(poDetailIds);

        if(listPoDetailIds.isEmpty()) {
            return ResponseMapper.toDataResponseSuccess(null);
        }

        List<PoDetail> poDetailList = poDetailRepository.getPoDetailsByPoDetailIdIn(listPoDetailIds);
        poDetailList.stream()
                .forEach(poDetail -> poDetail.setExportPartner(System.currentTimeMillis()));
        int updateCount = poDetailRepository.saveAll(poDetailList).size();

        return ResponseMapper.toDataResponseSuccess(updateCount + " hàng hóa cập nhật");
    }
}
