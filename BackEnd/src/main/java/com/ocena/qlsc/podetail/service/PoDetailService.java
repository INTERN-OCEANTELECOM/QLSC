package com.ocena.qlsc.podetail.service;

import com.ocena.qlsc.common.constants.RoleUser;
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
import com.ocena.qlsc.podetail.enums.RepairStatus;
import com.ocena.qlsc.podetail.model.PoDetail;
import com.ocena.qlsc.podetail.model.PoDetailMapper;
import com.ocena.qlsc.podetail.repository.PoDetailRepository;
import com.ocena.qlsc.podetail.status.ErrorType;
import com.ocena.qlsc.common.response.ErrorResponseImport;
import com.ocena.qlsc.podetail.status.RegexConstants;
import com.ocena.qlsc.podetail.status.UpdateField;
import com.ocena.qlsc.product.dto.ProductDTO;
import com.ocena.qlsc.product.model.Product;
import com.ocena.qlsc.product.repository.ProductRepository;
import com.ocena.qlsc.user.model.Role;
import com.ocena.qlsc.user.repository.RoleRepository;
import org.springframework.transaction.annotation.Propagation;
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
    protected Page<PoDetail> getPageResults(SearchKeywordDto searchKeywordDto, Pageable pageable) {
        return poDetailRepository.searchPoDetail(
                searchKeywordDto.getKeyword().get(0),
                searchKeywordDto.getKeyword().get(1),
                searchKeywordDto.getKeyword().get(2),
                searchKeywordDto.getKeyword().get(3),
                searchKeywordDto.getKeyword().get(4),
                searchKeywordDto.getKeyword().get(5),
                searchKeywordDto.getKeyword().get(6),
                searchKeywordDto.getKeyword().get(7),
                searchKeywordDto.getKeyword().get(8),
                searchKeywordDto.getKeyword().get(9),
                pageable);
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

    /**
     * Validates whether a PoDetail can be updated with a specific type of update.
     *
     * @param poDetail  the PoDetail to be updated
     * @param attribute The type of update to be performed on the PoDetail ({@link UpdateField} constants)
     * @param rowIndex  The index of the row in the import file that contains the PoDetail
     * @return true if the PoDetail can be updated with the specified type of update, false otherwise
     */
    public ErrorResponseImport validatePoDetailUpdate(PoDetail poDetail, String attribute, Integer rowIndex) {
        String errorMessage = "";
        if (attribute.equals(UpdateField.EXPORT_PARTNER)) {
            if (poDetail.getRepairStatus() == null) {
                errorMessage = " phải cập nhật trang thái SC trước khi cập nhật trạng thái xuất kho";
            }
        }
        if (attribute.equals(UpdateField.KCS_VT)) {
            if (poDetail.getExportPartner() == null) {
                errorMessage = " phải cập nhật trang thái SC và trạng thái xuất kho trước khi cập nhật KCS VT";
            }
//            if (poDetail.getRepairStatus() != RepairStatus.SC_XONG.ordinal()) {
//                errorMessage = " có trạng thái SC là " + RepairStatus.values()[poDetail.getRepairStatus()].name();
//            }
        }
        if (attribute.equals(UpdateField.WARRANTY_PERIOD)) {
            if (poDetail.getKcsVT() == null) {
                errorMessage = " phải cập nhật trang thái KSC VT trước khi cập nhật thông tin bảo hành";
            }
//            if (poDetail.getRepairStatus() != RepairStatus.SC_XONG.ordinal()) {
//                errorMessage = " có trạng thái SC là " + RepairStatus.values()[poDetail.getRepairStatus()].name();
//            }
        }
        if(errorMessage.equals("")) {
            return null;
        }
        return new ErrorResponseImport(ErrorType.DATA_NOT_FOUND,
                rowIndex, poDetail.getPoDetailId() + errorMessage);
    }

    public Object getPoDetail(PoDetailResponse poDetailResponse, int rowIndex, String attribute) throws NoSuchFieldException, NoSuchMethodException, IllegalAccessException, InvocationTargetException {
        Optional<PoDetail> isExistPoDetail = poDetailRepository.findByPoDetailId(poDetailResponse.getPoDetailId());
        // If the PO Detail does not exist, add an error to the list of errors and continue to the next row
        if (isExistPoDetail.isEmpty()) {
            return new ErrorResponseImport(ErrorType.DATA_NOT_FOUND,
                    rowIndex, poDetailResponse.getPoDetailId() + " không tồn tại");
        }
        PoDetail poDetail = isExistPoDetail.get();

        // If the update violates any validation rules, add an error to the list of errors and continue to the next row
        ErrorResponseImport validationError = validatePoDetailUpdate(poDetail, attribute, rowIndex);
        if (validationError != null) {
            return validationError;
        }

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
    public ListResponse<ErrorResponseImport> processFileUpdatePoDetail(MultipartFile file, String attribute) throws NoSuchMethodException, NoSuchFieldException, IllegalAccessException, InvocationTargetException {
        List<ErrorResponseImport> listError = new ArrayList<>();
        List<PoDetail> listUpdatePoDetail = new ArrayList<>();

        // Process the Excel file
        Object dataFile = processExcelFile.processExcelFile(file);
        //  If the Excel file could not be processed, return an error response
        if (dataFile instanceof ListResponse) {
            return (ListResponse) dataFile;
        }
        Iterator<Row> rowIterator = (Iterator<Row>) dataFile;

        // Validate the header row
        if (rowIterator.hasNext()) {
            Row row = rowIterator.next();
            RegexConstants regex = new RegexConstants();
            Field field = RegexConstants.class.getDeclaredField(attribute + "Map");
            ErrorResponseImport errorResponseImport = processExcelFile.validateHeaderValue(row, (HashMap<Integer, String>) field.get(regex));
            if (errorResponseImport != null) {
                listError.add(errorResponseImport);
                return ResponseMapper.toListResponse(listError, 0, 0, StatusCode.DATA_NOT_MAP, StatusMessage.DATA_NOT_MAP);
            }
        }

        // Read each row in the sheet and update the corresponding PO Detail in the database
        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();
            if (row.getCell(0) == null || row.getCell(0).getCellType() == CellType.BLANK) {
                // Stop reading data when an empty line is encountered
                break;
            }
            int rowIndex = row.getRowNum() + 1;

            // Read the data from the row
            Object data = readExcelUpdatePO(row, rowIndex, attribute);

            // If there is an error, add it to the list of errors; otherwise, update the corresponding PO Detail
            if (data instanceof ErrorResponseImport) {
                ErrorResponseImport errorResponseImport = (ErrorResponseImport) data;
                listError.add(errorResponseImport);
            } else {
                PoDetailResponse poDetailResponse = (PoDetailResponse) data;
                Object value = getPoDetail(poDetailResponse, rowIndex, attribute);
                if(value instanceof ErrorResponseImport) {
                    listError.add((ErrorResponseImport) value);
                } else {
                    listUpdatePoDetail.add((PoDetail) value);
                }
            }
        }

        if (listError.isEmpty()) {
            poDetailRepository.saveAll(listUpdatePoDetail);
            return ResponseMapper.toListResponseSuccess(List.of(
                    new ErrorResponseImport(ErrorType.DATA_SUCCESS, listUpdatePoDetail.size() + " dòng update thành công")));
        }
        return ResponseMapper.toListResponse(listError, listError.size(), 1, StatusCode.DATA_NOT_MAP, StatusMessage.DATA_NOT_MAP);
    }

    /**
     * Imports PO detail data from an Excel file and saves it to the database.
     *
     * @param file the Excel file containing the PO detail data
     * @return a list of ErrorResponseImport objects representing any errors that occurred during the import process
     * @throws IOException
     */
    @Transactional
    public ListResponse<ErrorResponseImport> importPODetail(MultipartFile file) {
        List<ErrorResponseImport> listError = new ArrayList<>();
        List<PoDetail> listInsertPoDetail = new ArrayList<>();

        // Process the Excel file
        Object dataFile = processExcelFile.processExcelFile(file);
        // If the Excel file could not be processed, return an error response
        if (processExcelFile.processExcelFile(file) instanceof ListResponse) {
            return (ListResponse) dataFile;
        }

        // Get an iterator over the rows in the Excel file
        Iterator<Row> rowIterator = (Iterator<Row>) processExcelFile.processExcelFile(file);

        // Validate header value
        if (rowIterator.hasNext()) {
            Row row = rowIterator.next();
            ErrorResponseImport errorResponseImport = processExcelFile.validateHeaderValue(row, RegexConstants.importPOHeader);
            if (errorResponseImport != null) {
                listError.add(errorResponseImport);
                return ResponseMapper.toListResponse(listError, 0, 0, StatusCode.DATA_NOT_MAP, StatusMessage.DATA_NOT_MAP);
            }
        }

        // Get a list of all products in the database
        List<Product> listAllProduct = productRepository.findAll();

        // Read each row in the Excel file and save the data to the database
        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();
            int rowIndex = row.getRowNum() + 1;

            if (row.getCell(0) == null || row.getCell(0).getCellType() == CellType.BLANK) {
                // Stop reading data when an empty line is encountered
                break;
            }

            // Read the data from the row
            Object data = readExcelRowData(row, rowIndex);

            // If there was an error reading the row, add it to the list of errors
            if (data instanceof ErrorResponseImport) {
                ErrorResponseImport errorResponseImport = (ErrorResponseImport) data;
                listError.add(errorResponseImport);
            } else {
                // If the row was read successfully, process the data
                PoDetailResponse poDetailResponse = (PoDetailResponse) data;

                // Check if the product in the row exists in the database
                boolean isProductExist = listAllProduct.stream()
                        .anyMatch(p -> p.getProductId().equals(poDetailResponse.getProduct().getProductId()));

                if (isProductExist) {
                    // If the product exists, continue processing the row

                    Optional<Po> isExistPoByPoNumber = poRepository.findByPoNumber(poDetailResponse.getPo().getPoNumber());
                    // // If the PO detail already exists in the database or has already been added to the list of PO details to be inserted, add an error
                    Optional<PoDetail> existPODetail = poDetailRepository.findByPoDetailId(poDetailResponse.getPoDetailId());
                    if (existPODetail.isPresent() || listInsertPoDetail.stream()
                            .anyMatch(value -> value.getPoDetailId().equals(poDetailResponse.getPoDetailId()))) {
                        listError.add(new ErrorResponseImport(ErrorType.RECORD_EXISTED,
                                rowIndex, poDetailResponse.getPoDetailId() + " đã tồn tại nên không thể import"));
                        continue;
                    }
                    if (isExistPoByPoNumber.isEmpty()) {
                        // If the PO for the PO detail does not exist in the database, add an error
                        listError.add(new ErrorResponseImport(ErrorType.DATA_NOT_FOUND,
                                rowIndex, poDetailResponse.getPoDetailId() + " có PO không tồn tại"));
                        continue;
                    }

                    // If the number of PO details for the PO has reached the PO quantity, add an error
                    // and stop processing the file
                    Integer quantity = isExistPoByPoNumber.get().getQuantity();
                    Long countPoDetailByPoNumber = poDetailRepository.countByPoNumber(poDetailResponse.getPo().getPoNumber());
                    if (countPoDetailByPoNumber + listInsertPoDetail.size() > quantity) {
                        listError.add(new ErrorResponseImport(poDetailResponse.getPo().getPoNumber(),
                                "Import nhiều hơn số lượng cho phép"));
                        break;
                    }

                    // If the PO detail is valid, convert it to an entity and add it to the list of PO details to be inserted
                    PoDetail poDetail = getBaseMapper().dtoToEntity(poDetailResponse);
//                    System.out.println(poDetail);
                    listInsertPoDetail.add(poDetail);
                } else {
                    listError.add(new ErrorResponseImport(ErrorType.DATA_NOT_FOUND,
                            rowIndex, poDetailResponse.getPoDetailId() + " có ProductID không tồn tại"));
                }
            }
        }

        if (listError.isEmpty()) {
            poDetailRepository.saveAll(listInsertPoDetail);
            return ResponseMapper.toListResponseSuccess(List.of(
                    new ErrorResponseImport(ErrorType.DATA_SUCCESS, listInsertPoDetail.size() + " dòng import thành công")));
        }
        return ResponseMapper.toListResponse(listError, listError.size(), 1, StatusCode.DATA_NOT_MAP, StatusMessage.DATA_NOT_MAP);
    }

    /**
     * Reads data from a row in an Excel file and returns an object representing the data.
     *
     * @param row      the row in the Excel file to read data from
     * @param rowIndex the index of the row in the Excel file
     * @return an object representing the data from the row, or an ErrorResponseImport object if there is an error
     */
    public Object readExcelRowData(Row row, int rowIndex) {

        // Validate the numeric columns with function validateNumbericColumns on column 0, 1, 6 in file excel
        ErrorResponseImport errorResponseImport = (ErrorResponseImport) processExcelFile.
                validateNumbericColumns(row, rowIndex, 0);
        if (errorResponseImport != null) {
            return errorResponseImport;
        }

        // If the columns are numeric, process the data
        Long productId = Long.valueOf((long) row.getCell(0).getNumericCellValue());
        String serialNumber = row.getCell(1).getStringCellValue();
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
    private Object readExcelUpdatePO(Row row, int rowIndex, String attribute) {
        // Validate the numeric columns with function validate NumbericColumns on column 0, 1, 4 in file excel
        ErrorResponseImport errorResponseImport = (ErrorResponseImport)
                processExcelFile.validateNumbericColumns(row, rowIndex, 0, 3);


        if (errorResponseImport != null) {
            return errorResponseImport;
        }

        Long productId = Long.valueOf((long) row.getCell(0).getNumericCellValue());
        String serialNumber = row.getCell(1).getStringCellValue();
        String poNumber = row.getCell(2).getStringCellValue();
        String poDetailId = poNumber + "-" + productId + "-" + serialNumber;

        PoDetailResponse poDetailResponse = PoDetailResponse.builder()
                .product(new ProductDTO(productId))
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

            return ResponseMapper.toDataResponse("", StatusCode.REQUEST_SUCCESS, StatusMessage.REQUEST_SUCCESS);
        }

        // Return an error response if the PO detail record was not found
        return ResponseMapper.toDataResponse(null, StatusCode.DATA_NOT_MAP, StatusMessage.DATA_NOT_MAP);
    }

    public DataResponse<String> deletePoDetail(String id) {
        Optional<PoDetail> poDetail = poDetailRepository.findByPoDetailId(id);
        if (poDetail.isPresent()) {
            poDetailRepository.delete(poDetail.get());
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
}
