package com.ocena.qlsc.podetail.controller;

import com.ocena.qlsc.common.controller.BaseApiImpl;
import com.ocena.qlsc.common.dto.SearchKeywordDto;
import com.ocena.qlsc.common.message.StatusCode;
import com.ocena.qlsc.common.message.StatusMessage;
import com.ocena.qlsc.common.response.DataResponse;
import com.ocena.qlsc.common.response.ListResponse;
import com.ocena.qlsc.common.response.ResponseMapper;
import com.ocena.qlsc.common.service.BaseService;
import com.ocena.qlsc.podetail.constants.RegexConstants;
import com.ocena.qlsc.podetail.dto.PoDetailDTO;
import com.ocena.qlsc.podetail.model.PoDetail;
import com.ocena.qlsc.podetail.repository.PoDetailRepository;
import com.ocena.qlsc.podetail.service.PoDetailService;
import com.ocena.qlsc.common.response.ErrorResponseImport;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.lang.reflect.InvocationTargetException;

@RestController
//@CrossOrigin(value = "*")
@RequestMapping("/po-detail")
public class PoDetailController extends BaseApiImpl<PoDetail, PoDetailDTO> {
    @Autowired
    PoDetailService poDetailService;

    @Autowired
    PoDetailRepository poDetailRepository;

    @Override
    protected BaseService getBaseService() {
        return poDetailService;
    }
    
    @Override
    public ListResponse<PoDetailDTO> getAllByPage(int page, int size) {
        return super.getAllByPage(page, size);
    }

    @Override
    public DataResponse<PoDetailDTO> update(@Valid PoDetailDTO poDetailResponse, String key) {
        return poDetailService.updatePoDetail(poDetailResponse, key);
    }

    @PostMapping("/deleteByID")
    public DataResponse<String> deleteByID(@RequestParam("id") String id) {
        return poDetailService.deletePoDetail(id);
    }

    @GetMapping("/getByPo/{id}")
    public ListResponse<PoDetailDTO> getByPO(@PathVariable("id") String poNumber) {
        return poDetailService.getByPO(poNumber);
    }

    @Parameter(in = ParameterIn.HEADER, name = "email", description = "Email Header")
    @PostMapping("/update")
    public ListResponse<?> updateFromExcel(@RequestParam("file") MultipartFile file) throws NoSuchFieldException, NoSuchMethodException, IllegalAccessException, InvocationTargetException {
        return poDetailService.updatePoDetailFromExcel(file);
    }
    @Parameter(in = ParameterIn.HEADER, name = "email", description = "Email Header")
    @PostMapping("/import")
    public ListResponse<?> importFromExcel(@RequestParam("file") MultipartFile file) {
        return poDetailService.importPODetailFromExcel(file);
    }

    @Parameter(in = ParameterIn.HEADER, name = "email", description = "Email Header")
    @PostMapping("/update/import-date")
    public DataResponse updateImportDate(@RequestParam("list") String listPoDetailId) {
        return poDetailService.updateImportDateOrExportPartner(listPoDetailId, RegexConstants.FIELDS_REGEX_MAP.get(RegexConstants.REGEX_IMPORT_DATE));
    }
    @Parameter(in = ParameterIn.HEADER, name = "email", description = "Email Header")
    @PostMapping("/update/export-partner")
    public DataResponse updateExportPartner(@RequestParam("list") String listPoDetailId) {
        return poDetailService.updateImportDateOrExportPartner(listPoDetailId, RegexConstants.FIELDS_REGEX_MAP.get(RegexConstants.REGEX_EXPORT_PARTNER));
    }

    @Parameter(in = ParameterIn.HEADER, name = "email", description = "Email Header")
    @PostMapping("/search/serialNumber")
    public ListResponse<PoDetailDTO> searchBySerialNumbers(@RequestParam("file") MultipartFile file) {
        return poDetailService.searchBySerialNumbers(file);
    }

    @Override
    public ListResponse<PoDetailDTO> getAll() {
        return super.getAll();
    }

    @Override
    public ListResponse<PoDetailDTO> searchByKeyword(SearchKeywordDto searchKeywordDto) {
        return searchKeywordDto.getProperty().equals("ALL")
        ? poDetailService.getAllByListKeyword(searchKeywordDto)
        : super.searchByKeyword(searchKeywordDto);
    }

    @Parameter(in = ParameterIn.HEADER, name = "email", description = "Email Header")
    @GetMapping("/serialNumber")
    public ListResponse<PoDetailDTO> getBySerialNumber(String serialNumber) {
        return poDetailService.getBySerialNumber(serialNumber);
    }


    /*Use For Swagger*/
    @Hidden
    @Override
    public DataResponse<PoDetailDTO> add(PoDetailDTO objectDTO) {
        return null;
    }
    @Hidden
    @Override
    public DataResponse<PoDetailDTO> getById(String id) {
        return null;
    }

    @Hidden
    @Override
    public ListResponse<PoDetailDTO> getByIds(String ids) {
        return null;
    }
    @Hidden
    @Override
    public ListResponse<PoDetail> getAllByKeyword(String keyword) {
        return null;
    }
    @Hidden
    @Override
    public DataResponse<PoDetailDTO> delete(String id) {
        return null;
    }
}
