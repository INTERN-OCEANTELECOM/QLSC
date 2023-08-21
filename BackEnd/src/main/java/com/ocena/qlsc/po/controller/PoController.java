package com.ocena.qlsc.po.controller;

import com.ocena.qlsc.common.annotation.ApiShow;
import com.ocena.qlsc.common.controller.BaseApiImpl;
import com.ocena.qlsc.common.dto.SearchKeywordDto;
import com.ocena.qlsc.common.error.exception.InvalidTimeException;
import com.ocena.qlsc.common.response.DataResponse;
import com.ocena.qlsc.common.response.ListResponse;
import com.ocena.qlsc.common.service.BaseService;
import com.ocena.qlsc.po.dto.PoRequest;
import com.ocena.qlsc.po.dto.PoResponse;
import com.ocena.qlsc.po.model.Po;
import com.ocena.qlsc.po.repository.PoRepository;
import com.ocena.qlsc.po.service.PoService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping(value = "po")
@RequiredArgsConstructor
public class PoController extends BaseApiImpl<Po, PoRequest, PoResponse> {

    @Autowired
    PoService poService;

    @Autowired
    PoRepository poRepository;

    @Override
    protected BaseService getBaseService() {
        return poService;
    }

    @Override
    @ApiShow
    @Cacheable(value = "getAllPO")
    public ListResponse<PoResponse> getAll() {
        return super.getAll();
    }

    @Override
    @ApiShow
    @CacheEvict(value = {"getAllPO", "getPoByPage"}, allEntries = true)
    public DataResponse<PoResponse> add(@Valid PoRequest poRequest) {
        if(poRequest.getBeginAt() != null && poRequest.getEndAt() != null && poRequest.getBeginAt() > poRequest.getEndAt()) {
            throw new InvalidTimeException("Invalid Time");
        }
        return super.add(poRequest);
    }

    @Override
    @ApiShow
    @CacheEvict(value = {"getAllPO", "getPoByPage"}, allEntries = true)
    public DataResponse<PoResponse> update(@Valid PoRequest poRequest, String key) {
        poService.validateUpdatePo(poRequest, key);
        return super.update(poRequest, key);
    }

    @ApiShow
    @GetMapping(value = "/{poNumber}")
    public DataResponse<HashMap<String, HashMap<String, Integer>>> getStatisticsByPoNumber(@PathVariable("poNumber") String poNumber) {
        return poService.getStatisticsByPoNumber(poNumber);
    }

    @ApiShow
    @Override
    public ListResponse<PoResponse> searchByKeyword(SearchKeywordDto searchKeywordDto) {
        return super.searchByKeyword(searchKeywordDto);
    }

    @Override
    @ApiShow
    @Cacheable(value = "getPoByPage")
    public ListResponse<PoResponse> getAllByPage(int page, int size) {
        return super.getAllByPage(page, size);
    }
}
