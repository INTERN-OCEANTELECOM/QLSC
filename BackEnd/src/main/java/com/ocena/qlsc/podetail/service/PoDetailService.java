package com.ocena.qlsc.podetail.service;

import com.ocena.qlsc.common.util.ReflectionUtil;
import com.ocena.qlsc.podetail.status.UpdateFieldsVN;
import com.ocena.qlsc.user.model.RoleUser;
import com.ocena.qlsc.common.dto.SearchKeywordDto;
import com.ocena.qlsc.common.message.StatusCode;
import com.ocena.qlsc.common.message.StatusMessage;
import com.ocena.qlsc.common.model.BaseMapper;
import com.ocena.qlsc.common.repository.BaseRepository;
import com.ocena.qlsc.common.response.DataResponse;
import com.ocena.qlsc.common.response.ListResponse;
import com.ocena.qlsc.common.response.ResponseMapper;
import com.ocena.qlsc.common.service.BaseServiceImpl;
import com.ocena.qlsc.common.util.SystemUtil;
import com.ocena.qlsc.po.dto.PoDTO;
import com.ocena.qlsc.po.model.Po;
import com.ocena.qlsc.po.repository.PoRepository;
import com.ocena.qlsc.podetail.dto.PoDetailResponse;
import com.ocena.qlsc.podetail.model.PoDetail;
import com.ocena.qlsc.podetail.model.PoDetailMapper;
import com.ocena.qlsc.podetail.repository.PoDetailRepository;
import com.ocena.qlsc.podetail.status.ErrorType;
import com.ocena.qlsc.common.response.ErrorResponseImport;
import com.ocena.qlsc.podetail.status.RegexConstants;
import com.ocena.qlsc.podetail.status.UpdateField;
import com.ocena.qlsc.product.dto.ProductDTO;
import com.ocena.qlsc.product.repository.ProductRepository;
import com.ocena.qlsc.user.model.Role;
import com.ocena.qlsc.user.repository.RoleRepository;
import com.ocena.qlsc.user_history.enums.Action;
import com.ocena.qlsc.user_history.enums.ObjectName;
import com.ocena.qlsc.user_history.model.SpecificationDesc;
import com.ocena.qlsc.user_history.service.HistoryService;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.transaction.annotation.Transactional;
import org.apache.poi.ss.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class PoDetailService extends BaseServiceImpl<PoDetail, PoDetailResponse> implements IPoDetail {
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
    ProcessExcelFile processExcelFile;

    @Autowired
    HistoryService historyService;

    @Override
    public List<String> validationRequest(Object object) {
        return super.validationRequest(object);
    }

    @Override
    protected BaseRepository<PoDetail> getBaseRepository() {
        return poDetailRepository;
    }

    @Override
    protected BaseMapper<PoDetail, PoDetailResponse> getBaseMapper() {
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
    protected Page<PoDetail> getPageResults(SearchKeywordDto searchKeywordDto, Pageable pageable) {
        List<PoDetail> poDetailList = poDetailRepository.searchPoDetail(
                searchKeywordDto.getKeyword().get(0),
//                searchKeywordDto.getKeyword().get(1),
                searchKeywordDto.getKeyword().get(2),
                searchKeywordDto.getKeyword().get(3),
                searchKeywordDto.getKeyword().get(4),
                searchKeywordDto.getKeyword().get(5),
                searchKeywordDto.getKeyword().get(6),
                searchKeywordDto.getKeyword().get(7),
                searchKeywordDto.getKeyword().get(8),
                searchKeywordDto.getKeyword().get(9));

        String[] arr = Optional.ofNullable(searchKeywordDto.getKeyword().get(1))
                .filter(str -> !str.isEmpty())
                .map(str -> str.trim().split("\\s+"))
                .orElse(new String[0]);

        if (arr.length > 0) {
            List<String> listSerialNumbers = Arrays.asList(arr);
            List<PoDetail> listSerialNumber = poDetailRepository.findAllBySerialNumberIn(listSerialNumbers);
            List<PoDetail> commonList = poDetailList
                    .stream()
                    .filter(poDetail1 -> listSerialNumber.stream().anyMatch(poDetail2 -> poDetail2.getPoDetailId().equals(poDetail1.getPoDetailId())))
                    .collect(Collectors.toList());

            //Create Page with Start End
            List<PoDetail> pagePoDetailWithSerialNumber= commonList
                    .subList(pageable.getPageNumber() * pageable.getPageSize(),
                            Math.min(pageable.getPageNumber() * pageable.getPageSize() + pageable.getPageSize(), commonList.size()));

            return new PageImpl<>(pagePoDetailWithSerialNumber, pageable, commonList.size());
        }
        List<PoDetail> pagePoDetails = poDetailList
                .subList(pageable.getPageNumber() * pageable.getPageSize(),
                        Math.min(pageable.getPageNumber() * pageable.getPageSize() + pageable.getPageSize(), poDetailList.size()));

        return new PageImpl<>(pagePoDetails, pageable, poDetailList.size());

    }

    @Override
    protected List<PoDetail> getListSearchResults(String keyword) {
        return null;
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

//    public ErrorResponseImport validatePoDetailUpdate(PoDetail poDetail, String attribute, Integer rowIndex) {
//        String errorMessage = "";
//        if (attribute.equals(UpdateField.EXPORT_PARTNER)) {
//            if (poDetail.getRepairStatus() == null) {
//                errorMessage = " phải cập nhật trang thái SC trước khi cập nhật trạng thái xuất kho";
//            }
//        }
//        if (attribute.equals(UpdateField.KCS_VT)) {
//            if (poDetail.getExportPartner() == null) {
//                errorMessage = " phải cập nhật trang thái SC và trạng thái xuất kho trước khi cập nhật KCS VT";
//            }
////            if (poDetail.getRepairStatus() != RepairStatus.SC_XONG.ordinal()) {
////                errorMessage = " có trạng thái SC là " + RepairStatus.values()[poDetail.getRepairStatus()].name();
////            }
//        }
//        if (attribute.equals(UpdateField.WARRANTY_PERIOD)) {
//            if (poDetail.getKcsVT() == null) {
//                errorMessage = " phải cập nhật trang thái KSC VT trước khi cập nhật thông tin bảo hành";
//            }
////            if (poDetail.getRepairStatus() != RepairStatus.SC_XONG.ordinal()) {
////                errorMessage = " có trạng thái SC là " + RepairStatus.values()[poDetail.getRepairStatus()].name();
////            }
//        }
//        if(errorMessage.equals("")) {
//            return null;
//        }
//        return new ErrorResponseImport(ErrorType.DATA_NOT_FOUND,
//                rowIndex, poDetail.getPoDetailId() + errorMessage);
//    }

    public Object setDataFromDTO(PoDetailResponse poDetailResponse, int rowIndex, String attribute) throws NoSuchFieldException, NoSuchMethodException, IllegalAccessException, InvocationTargetException {
        Optional<PoDetail> isExistPoDetail = poDetailRepository.findByPoDetailId(poDetailResponse.getPoDetailId());
        // If the PO Detail does not exist, add an error to the list of errors and continue to the next row
        if (isExistPoDetail.isEmpty()) {
            return new ErrorResponseImport(ErrorType.DATA_NOT_FOUND,
                    rowIndex, poDetailResponse.getPoDetailId() + " không tồn tại");
        }
        PoDetail poDetail = isExistPoDetail.get();

        try {
            Field field = PoDetailResponse.class.getDeclaredField(attribute);
            field.setAccessible(true);
            String setterMethod = "set" + attribute.substring(0, 1).toUpperCase()
                    + attribute.substring(1);

            // if field want update not is Warranty Period
            if (attribute.equals(UpdateField.WARRANTY_PERIOD) || attribute.equals(UpdateField.IMPORT_DATE)) {
                Long value = (Long) field.get(poDetailResponse);
                Method setter = poDetail.getClass().getMethod(setterMethod, Long.class);
                setter.invoke(poDetail, value);
            }
//            else if (attribute.equals(UpdateField.BBBG_NUMBER) || attribute.equals(UpdateField.BBBG_NUMBER_PARTNER)){
//                String value = (String) field.get(poDetailResponse);
//                Method setter = poDetail.getClass().getMethod(setterMethod, String.class);
//                setter.invoke(poDetail, value);
//            }
            else if(attribute.equals(UpdateField.EXPORT_PARTNER)) {
                poDetail.setExportPartner(poDetailResponse.getExportPartner());
                poDetail.setBbbgNumberExport(poDetailResponse.getBbbgNumberExport());
            }
            else {
                Short value = (Short) field.get(poDetailResponse);
                Method setter = poDetail.getClass().getMethod(setterMethod, Short.class);
                setter.invoke(poDetail, value);
            }
            return poDetail;
        } catch (NoSuchFieldException | NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
            return new ErrorResponseImport(ErrorType.DATA_NOT_MAP, ErrorType.DATA_NOT_MAP);
        } finally {
            return poDetail;
        }
    }

    /**
     * Processes an Excel file containing information about PO Details and updates their information in the database.
     *
     * @param file      the Excel file to process
     * @param attribute the attribute to update
     * @return a ListResponse containing a list of errors if any errors occurred during processing, or a list of updated PO Details if no errors occurred
     * @throws NoSuchMethodException     if a specified method does not exist
     * @throws NoSuchFieldException      if a specified field does not exist
     * @throws IllegalAccessException    if access to a specified field is denied
     * @throws InvocationTargetException if a specified method cannot be invoked
     */
    @SuppressWarnings("unchecked")
    public ListResponse<ErrorResponseImport> processFileUpdatePoDetail(MultipartFile file, String attribute) throws NoSuchMethodException, NoSuchFieldException, IllegalAccessException, InvocationTargetException {
        LinkedList<ErrorResponseImport> listErrorResponse = new LinkedList<>();
        List<PoDetail> listUpdatePoDetail = new ArrayList<>();

        // Process the Excel file
        Object dataFile = processExcelFile.getSheetIteratorFromExcelFile(file);
        //  If the Excel file could not be processed, return an error response
        if (dataFile instanceof ListResponse) {
            return (ListResponse) dataFile;
        }
        Iterator<Row> rowIterator = (Iterator<Row>) dataFile;

        // Validate the header row
        ErrorResponseImport errorResponse = processExcelFile.
                validateHeaderValue(rowIterator, (HashMap<Integer, String>) ReflectionUtil.getFieldValueByReflection(attribute + "Map", new RegexConstants()));
        if(errorResponse != null) {
            listErrorResponse.add(errorResponse);
            return ResponseMapper.toListResponse(listErrorResponse, 0, 0, StatusCode.DATA_NOT_MAP, StatusMessage.DATA_NOT_MAP);
        }

        // Read each row in the sheet and update the corresponding PO Detail in the database
        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();
            if(processExcelFile.isLastedRow(row)) {
                break;
            }
            int rowIndex = row.getRowNum() + 1;

            // Read the data from the row
            Object data = readExcelRowUpdate(row, rowIndex, attribute);

            // If there is an error, add it to the list of errors; otherwise, update the corresponding PO Detail
            if (data instanceof ErrorResponseImport) {
                ErrorResponseImport errorResponseImport = (ErrorResponseImport) data;
                listErrorResponse.add(errorResponseImport);
            } else {
                PoDetailResponse poDetailResponse = (PoDetailResponse) data;

                if(listUpdatePoDetail.stream()
                        .anyMatch(poDetail -> poDetail.getPoDetailId().equals(poDetailResponse.getPoDetailId()))) {
                    listErrorResponse.add(new ErrorResponseImport(ErrorType.RECORD_EXISTED,
                            rowIndex, poDetailResponse.getPoDetailId() + " bị trùng"));
                    continue;
                }
                Object value = setDataFromDTO(poDetailResponse, rowIndex, attribute);
                if(value instanceof ErrorResponseImport) {
                    listErrorResponse.add((ErrorResponseImport) value);
                } else {
                    listUpdatePoDetail.add((PoDetail) value);
                }
            }
        }

        if (listErrorResponse.isEmpty() && listUpdatePoDetail.size() > 0) {
            poDetailRepository.saveAll(listUpdatePoDetail);
            saveHistoryImportDataExcel(Action.UPDATE.getValue(), listUpdatePoDetail, attribute);
            return ResponseMapper.toListResponseSuccess(List.of(
                    new ErrorResponseImport(ErrorType.DATA_SUCCESS, listUpdatePoDetail.size() + " dòng update thành công")));
        }
        return ResponseMapper.toListResponse(listErrorResponse, listErrorResponse.size(), 1, StatusCode.DATA_NOT_MAP, StatusMessage.DATA_NOT_MAP);
    }

    public ListResponse<PoDetailResponse> searchBySerialNumbers(MultipartFile file) {
        LinkedList<ErrorResponseImport> listError = new LinkedList<>();
        Object dataFile = processExcelFile.getSheetIteratorFromExcelFile(file);
        if(dataFile instanceof ListResponse<?>) {
            return (ListResponse) dataFile;
        }
        // Get an iterator over the rows in the Excel file
        Iterator<Row> rowIterator = (Iterator<Row>) dataFile;
        // Validate header value
        ErrorResponseImport errorResponseImport = processExcelFile.validateHeaderValue(rowIterator, RegexConstants.searchSerialNumbers);
        if(errorResponseImport != null) {
            listError.add(errorResponseImport);
            return ResponseMapper.toListResponse(listError, 0, 0, StatusCode.DATA_NOT_MAP, StatusMessage.DATA_NOT_MAP);
        }

        List<String> listSearchSerialNumber = new ArrayList<>();
        while (rowIterator.hasNext()) {

            Row row = rowIterator.next();
            int rowIndex = row.getRowNum() + 1;

            if (row.getCell(0).getCellType() == CellType.BLANK) {
                // Stop reading data when an empty line is encountered
                listError.add(new ErrorResponseImport(ErrorType.DATA_NOT_MAP, rowIndex, "Dữ liệu không được để trống"));
            }

            String serialNumber = row.getCell(0).getStringCellValue();
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

    private ErrorResponseImport validateDataImport(PoDetailResponse poDetailResponse, List<PoDetail> listInsert, Integer rowIndex) {
        // Check if the product in the row exists in the database
        boolean isProductExist = productRepository.findAll().stream()
                .anyMatch(p -> p.getProductId().equals(poDetailResponse.getProduct().getProductId()));

        if (isProductExist) {
            // If the product exists, continue processing the row
            Optional<Po> isExistPoByPoNumber = poRepository.findByPoNumber(poDetailResponse.getPo().getPoNumber());
            // // If the PO detail already exists in the database or has already been added to the list of PO details to be inserted, add an error
            Optional<PoDetail> existPODetail = poDetailRepository.findByPoDetailId(poDetailResponse.getPoDetailId());
            if (existPODetail.isPresent() || listInsert.stream()
                    .anyMatch(value -> value.getPoDetailId().equals(poDetailResponse.getPoDetailId()))) {
                return new ErrorResponseImport(ErrorType.RECORD_EXISTED,
                        rowIndex, poDetailResponse.getPoDetailId() + " đã tồn tại nên không thể import");
            }
            if (isExistPoByPoNumber.isEmpty()) {
                // If the PO for the PO detail does not exist in the database, add an error
                return new ErrorResponseImport(ErrorType.DATA_NOT_FOUND,
                        rowIndex, poDetailResponse.getPoDetailId() + " có PO không tồn tại");
            }

            // If the number of PO details for the PO has reached the PO quantity, add an error
            // and stop processing the file
            Integer quantity = isExistPoByPoNumber.get().getQuantity();
            Long countPoDetailByPoNumber = poDetailRepository.countByPoNumber(poDetailResponse.getPo().getPoNumber());
            if (countPoDetailByPoNumber + listInsert.size() > quantity) {
                return new ErrorResponseImport(poDetailResponse.getPo().getPoNumber(),
                        "Import nhiều hơn số lượng cho phép");
            }
        } else {
            return new ErrorResponseImport(ErrorType.DATA_NOT_FOUND,
                    rowIndex, poDetailResponse.getPoDetailId() + " có Mã Hàng Hóa không tồn tại");
        }
        return null;
    }

    public void saveHistoryImportDataExcel(String action, List<PoDetail> listInsertPoDetail, String attribute) {
        // Get List PoNumber distinct
        List<String> distinctPoNumber = listInsertPoDetail.stream()
                .map(poDetail -> poDetail.getPo().getPoNumber())
                .distinct()
                .collect(Collectors.toList());

        SpecificationDesc specificationDesc = new SpecificationDesc();
        specificationDesc.setRecord(String.join(", ", distinctPoNumber));
        specificationDesc.setAmount(((Integer) listInsertPoDetail.size()).toString());
        if(!attribute.equals("")) {
            String fields = (String) ReflectionUtil.getFieldValueByReflection(attribute, new UpdateFieldsVN());
            specificationDesc.setFields(fields);
        }
        String descriptionHistory = "";
        for (PoDetail poDetail : listInsertPoDetail) {
            descriptionHistory += "<" + poDetail.getSerialNumber().toString() + "> ";
        }
        specificationDesc.setDescription(specificationDesc.setDesc(descriptionHistory));
        historyService.saveHistory(action, ObjectName.PoDetail, specificationDesc.getSpecification(), "");
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
    public ListResponse<ErrorResponseImport> importPODetail(MultipartFile file) {
        LinkedList<ErrorResponseImport> listErrorResponse = new LinkedList<>();
        List<PoDetail> listInsertPoDetail = new ArrayList<>();

        // Process the Excel file
        Object dataFile = processExcelFile.getSheetIteratorFromExcelFile(file);
        // If the Excel file could not be processed, return an error response
        if (dataFile instanceof ListResponse) {
            return (ListResponse) dataFile;
        }

        // Get an iterator over the rows in the Excel file
        Iterator<Row> rowIterator = (Iterator<Row>) dataFile;

        // Validate header value
        ErrorResponseImport errorResponse = processExcelFile.validateHeaderValue(rowIterator, RegexConstants.importPOHeader);
        if(errorResponse != null) {
            listErrorResponse.add(errorResponse);
            return ResponseMapper.toListResponse(listErrorResponse, 0, 0, StatusCode.DATA_NOT_MAP, StatusMessage.DATA_NOT_MAP);
        }

        // Read each row in the Excel file and save the data to the database
        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();
            int rowIndex = row.getRowNum() + 1;

            if(processExcelFile.isLastedRow(row)) {
                break;
            }

            // Read the data from the row
            Object data = readExcelRowDataImport(row, rowIndex);

            // If there was an error reading the row, add it to the list of errors
            if (data instanceof ErrorResponseImport) {
                errorResponse = (ErrorResponseImport) data;
                listErrorResponse.add(errorResponse);
            } else {
                // If the row was read successfully, process the data
                PoDetailResponse poDetailResponse = (PoDetailResponse) data;

                // Validate poDetail
                errorResponse = validateDataImport(poDetailResponse, listInsertPoDetail, rowIndex);
                if(errorResponse != null) {
                    listErrorResponse.add(errorResponse);
                    if (errorResponse.getErrorDescription().equals("Import nhiều hơn số lượng cho phép"))
                        break;
                    continue;
                }
                // If the PO detail is valid, convert it to an entity and add it to the list of PO details to be inserted
                PoDetail poDetail = getBaseMapper().dtoToEntity(poDetailResponse);
                listInsertPoDetail.add(poDetail);
            }
        }

        if (listErrorResponse.isEmpty() && listInsertPoDetail.size() > 0) {
            poDetailRepository.saveAll(listInsertPoDetail);
            saveHistoryImportDataExcel(Action.IMPORT.getValue(), listInsertPoDetail, "");
            return ResponseMapper.toListResponseSuccess(List.of(
                    new ErrorResponseImport(ErrorType.DATA_SUCCESS, listInsertPoDetail.size() + " dòng import thành công")));
        }
        return ResponseMapper.toListResponse(listErrorResponse, listErrorResponse.size(), 1, StatusCode.DATA_NOT_MAP, StatusMessage.DATA_NOT_MAP);
    }

    /**
     * Reads data from a row in an Excel file and returns an object representing the data.
     *
     * @param row      the row in the Excel file to read data from
     * @param rowIndex the index of the row in the Excel file
     * @return an object representing the data from the row, or an ErrorResponseImport object if there is an error
     */
    public Object readExcelRowDataImport(Row row, int rowIndex) {
        // Validate the text columns
        ErrorResponseImport errorResponseImport = (ErrorResponseImport)
                processExcelFile.validateTextColumns(row, rowIndex, 2);
        if (errorResponseImport != null) {
            return errorResponseImport;
        }
        // If the columns are numeric, process the data

        String productId = processExcelFile.getCellValueIsNumberOrString(row, 0);
        String serialNumber = processExcelFile.getCellValueIsNumberOrString(row, 1);
        String poNumber = row.getCell(2).getStringCellValue();

        String poDetailId = poNumber + "-" + productId + "-" + serialNumber;
        PoDetailResponse poDetailResponse = PoDetailResponse.builder()
                .poDetailId(poDetailId)
                .product(new ProductDTO(productId))
                .serialNumber(serialNumber)
                .po(new PoDTO(poNumber))
                .build();

        // Validate the PO detail object and return it if it is valid
        List<String> resultError = validationRequest(poDetailResponse);
        if (resultError == null) {
            return poDetailResponse;
        } else {
            // If the PO detail object is invalid, return an ErrorResponseImport object with an error message
            return new ErrorResponseImport(ErrorType.DATA_NOT_MAP, rowIndex, resultError.get(0));
        }
    }

    /**
     * Reads data from an Excel file and creates a PoDetailResponse object if the data is valid.
     *
     * @param row       the row to read data from
     * @param rowIndex  the index of the row
     * @param attribute the attribute to set
     * @return a PoDetailResponse object if the data is valid, otherwise an ErrorResponseImport object
     */
    private Object readExcelRowUpdate(Row row, int rowIndex, String attribute) {
        // Validate the numeric columns
        ErrorResponseImport errorResponseImport = (ErrorResponseImport)
                processExcelFile.validateNumbericColumns(row, rowIndex, 3);
        if (errorResponseImport != null) {
            return errorResponseImport;
        }
        errorResponseImport = (ErrorResponseImport)
                processExcelFile.validateTextColumns(row, rowIndex, 2);
        if (errorResponseImport != null) {
            return errorResponseImport;
        }

        String productId = processExcelFile.getCellValueIsNumberOrString(row, 0);
        String serialNumber = processExcelFile.getCellValueIsNumberOrString(row, 1);
        String poNumber = row.getCell(2).getStringCellValue();
        String poDetailId = poNumber + "-" + productId + "-" + serialNumber;

        PoDetailResponse poDetailResponse = PoDetailResponse.builder()
                .product(new ProductDTO(productId))
                .serialNumber(serialNumber)
                .poDetailId(poDetailId)
                .po(new PoDTO(poNumber))
                .build();

        // Set the specified attribute of the PoDetailResponse object
        String setterMethod = "set" + attribute.substring(0, 1).toUpperCase()
                + attribute.substring(1);
        Method setter = null;
        try {

//            else if(row.getCell(3).getCellType() == CellType.STRING){
//                setter = poDetailResponse.getClass().getMethod(setterMethod.toString(), String.class);
//                setter.invoke(poDetailResponse, row.getCell(3).getStringCellValue());
//            }
            // If cell type is Date, read data with getDateCellValue
            if(attribute.equals(UpdateField.EXPORT_PARTNER)) {
                poDetailResponse.setExportPartner(row.getCell(3).getDateCellValue().getTime());
                poDetailResponse.setBbbgNumberExport(row.getCell(4).getStringCellValue());
            } else if(row.getCell(3).getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(row.getCell(3))) {
                setter = poDetailResponse.getClass().getMethod(setterMethod.toString(), Long.class);
                setter.invoke(poDetailResponse, row.getCell(3).getDateCellValue().getTime());
            }
            else {
                setter = poDetailResponse.getClass().getMethod(setterMethod.toString(), Short.class);
                setter.invoke(poDetailResponse, (short) row.getCell(3).getNumericCellValue());
            }
        } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
            System.out.println(e.getMessage());
        }

        // Validate the PoDetailResponse object
        List<String> resultError = validationRequest(poDetailResponse);

        // If the PoDetailResponse object is valid, return it; otherwise, return an error response
        if (resultError == null) {
//            return mapper.convertTo(poDetailRequest, PoDetail.class);
            return poDetailResponse;
        } else {
            return new ErrorResponseImport(ErrorType.DATA_NOT_MAP, rowIndex, resultError.get(0));
        }
    }

    /**
     * Updates a PO detail record in the database with new data.
     *
     * @param poDetailResponse the new data to be saved
     * @param key              the ID of the PO detail record to be updated
     * @return a DataResponse object indicating whether the update was successful or not
     */
    @Transactional
    public DataResponse<PoDetailResponse> updatePoDetail(PoDetailResponse poDetailResponse, String key) {
        List<String> result = validationRequest(poDetailResponse);

        // Validate the request data
        if ((result != null)) {
            return ResponseMapper.toDataResponse(result, StatusCode.DATA_NOT_MAP, StatusMessage.DATA_NOT_MAP);
        }

        Optional<PoDetail> poDetail = poDetailRepository.findByPoDetailId(key);
        // Update the PO detail record with the new data
        if (poDetail.isPresent()) {
            SpecificationDesc specificationDesc = new SpecificationDesc();
            specificationDesc.setRecord(poDetailResponse.getPoDetailId());
            String compare = poDetail.get().compare(getBaseMapper().dtoToEntity(poDetailResponse), Action.EDIT, specificationDesc);
            specificationDesc.setDescription(compare);

            poDetail.get().setRepairCategory(poDetailResponse.getRepairCategory());
            poDetail.get().setRepairStatus((poDetailResponse.getRepairStatus()));
            poDetail.get().setKcsVT(poDetailResponse.getKcsVT());
            poDetail.get().setBbbgNumberExport(poDetailResponse.getBbbgNumberExport());
            poDetail.get().setNote(poDetailResponse.getNote());
            poDetail.get().setWarrantyPeriod(poDetailResponse.getWarrantyPeriod());
            poDetail.get().setImportDate(poDetailResponse.getImportDate());
            poDetail.get().setExportPartner(poDetailResponse.getExportPartner());
            poDetail.get().setPriority(poDetailResponse.getPriority());

            poDetailRepository.save(poDetail.get());
            historyService.saveHistory(Action.EDIT.getValue(), ObjectName.PoDetail, specificationDesc.getSpecification(), "");

            return ResponseMapper.toDataResponse("", StatusCode.REQUEST_SUCCESS, StatusMessage.REQUEST_SUCCESS);
        }

        // Return an error response if the PO detail record was not found
        return ResponseMapper.toDataResponse(null, StatusCode.DATA_NOT_FOUND, StatusMessage.DATA_NOT_FOUND);
    }

    public DataResponse<String> deletePoDetail(String id) {
        Optional<PoDetail> poDetail = poDetailRepository.findByPoDetailId(id);
        if (poDetail.isPresent()) {
            /* Save History */
            SpecificationDesc specificationDesc = new SpecificationDesc();
            specificationDesc.setRecord(poDetail.get().getPoDetailId());

            poDetailRepository.delete(poDetail.get());
            historyService.saveHistory(Action.DELETE.getValue(), ObjectName.PoDetail, specificationDesc.getSpecification(), "");
            return ResponseMapper.toDataResponseSuccess("Success");
        }
        return ResponseMapper.toDataResponseSuccess(null);
    }

    public Boolean validateRoleUpdatePO(String attribute) throws NoSuchMethodException, NoSuchFieldException, IllegalAccessException, InvocationTargetException {
        String email = SystemUtil.getCurrentEmail();
        List<Role> allRoles = roleRepository.getRoleByEmail(email);

        for (Role role : allRoles) {
            if ((role.getRoleName().equals(RoleUser.ROLE_ADMIN.name()) || role.getRoleName().equals(RoleUser.ROLE_MANAGER.name()))
                    || (attribute.equals(UpdateField.REPAIR_STATUS) && !role.getRoleName().equals(RoleUser.ROLE_KCSANALYST.name()))
                    || (attribute.equals(UpdateField.KCS_VT) && !role.getRoleName().equals(RoleUser.ROLE_REPAIRMAN.name()))) {
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
}
