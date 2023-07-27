package com.ocena.qlsc.podetail.controller;

import com.ocena.qlsc.common.controller.BaseApiImpl;
import com.ocena.qlsc.common.dto.SearchKeywordDto;
import com.ocena.qlsc.common.message.StatusCode;
import com.ocena.qlsc.common.message.StatusMessage;
import com.ocena.qlsc.common.response.DataResponse;
import com.ocena.qlsc.common.response.ListResponse;
import com.ocena.qlsc.common.response.ResponseMapper;
import com.ocena.qlsc.common.service.BaseService;
import com.ocena.qlsc.podetail.dto.PoDetailResponse;
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
import java.util.ArrayList;
import java.util.List;

@RestController
//@CrossOrigin(value = "*")
@RequestMapping("/po-detail")
public class PoDetailController extends BaseApiImpl<PoDetail, PoDetailResponse> {
    @Autowired
    PoDetailService poDetailService;

    @Autowired
    PoDetailRepository poDetailRepository;

    @Override
    protected BaseService getBaseService() {
        return poDetailService;
    }
    
    @Override
    public ListResponse<PoDetailResponse> getAllByPage(int page, int size) {
        return super.getAllByPage(page, size);
    }

    @Override
    public DataResponse<PoDetailResponse> update(@Valid PoDetailResponse poDetailResponse, String key) {
        return poDetailService.updatePoDetail(poDetailResponse, key);
    }

    @PostMapping("/deleteByID")
    public DataResponse<String> deleteByID(@RequestParam("id") String id) {
        return poDetailService.deletePoDetail(id);
    }

    @GetMapping("/getByPo/{id}")
    public ListResponse<PoDetailResponse> getByPO(@PathVariable("id") String poNumber) {
        return poDetailService.getByPO(poNumber);
    }

    @Parameter(in = ParameterIn.HEADER, name = "email", description = "Email Header")
    @PostMapping("/update")
    public ListResponse<ErrorResponseImport> updateStatus(@RequestParam("file") MultipartFile file,
                                                          @RequestParam("attribute") String attribute) throws NoSuchFieldException, NoSuchMethodException, IllegalAccessException, InvocationTargetException {
        return poDetailService.validateRoleUpdatePO(attribute)
                ? poDetailService.processFileUpdatePoDetail(file, attribute)
                : ResponseMapper.toListResponse(null, 0, 0, StatusCode.LOCK_ACCESS, StatusMessage.NOT_PERMISSION);
    }
    @Parameter(in = ParameterIn.HEADER, name = "email", description = "Email Header")
    @PostMapping("/import")
    public ListResponse<ErrorResponseImport> importPODetail(@RequestParam("file") MultipartFile file) {
        return poDetailService.importPODetail(file);
    }

    @Parameter(in = ParameterIn.HEADER, name = "email", description = "Email Header")
    @PostMapping("/search/serialNumber")
    public ListResponse<PoDetailResponse> searchBySerialNumbers(@RequestParam("file") MultipartFile file) {
        return poDetailService.searchBySerialNumbers(file);
    }

    @Override
    public ListResponse<PoDetailResponse> getAll() {
        return super.getAll();
    }

    @Override
    public ListResponse<PoDetail> searchByKeyword(SearchKeywordDto searchKeywordDto) {
        return super.searchByKeyword(searchKeywordDto);
    }

    @Parameter(in = ParameterIn.HEADER, name = "email", description = "Email Header")
    @GetMapping("/serialNumber")
    public ListResponse<PoDetailResponse> getBySerialNumber(String serialNumber) {
        return poDetailService.getBySerialNumber(serialNumber);
    }


    /*Use For Swagger*/
    @Hidden
    @Override
    public DataResponse<PoDetailResponse> add(PoDetailResponse objectDTO) {
        return null;
    }
    @Hidden
    @Override
    public DataResponse<PoDetailResponse> getById(String id) {
        return null;
    }

    @Hidden
    @Override
    public ListResponse<PoDetailResponse> getByIds(String ids) {
        return null;
    }
    @Hidden
    @Override
    public ListResponse<PoDetail> getAllByKeyword(String keyword) {
        return null;
    }
    @Hidden
    @Override
    public DataResponse<PoDetailResponse> delete(String id) {
        return null;
    }
}
