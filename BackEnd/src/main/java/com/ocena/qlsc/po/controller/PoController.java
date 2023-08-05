package com.ocena.qlsc.po.controller;

import com.ocena.qlsc.common.controller.BaseApiImpl;
import com.ocena.qlsc.common.dto.SearchKeywordDto;
import com.ocena.qlsc.common.message.StatusCode;
import com.ocena.qlsc.common.message.StatusMessage;
import com.ocena.qlsc.common.response.DataResponse;
import com.ocena.qlsc.common.response.ListResponse;
import com.ocena.qlsc.common.response.ResponseMapper;
import com.ocena.qlsc.common.service.BaseService;
import com.ocena.qlsc.po.dto.PoDTO;
import com.ocena.qlsc.po.model.Po;
import com.ocena.qlsc.po.repository.PoRepository;
import com.ocena.qlsc.po.service.PoService;
import com.ocena.qlsc.podetail.model.PoDetail;
import io.swagger.v3.oas.annotations.Hidden;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;

@RestController
@RequestMapping(value = "po")
@RequiredArgsConstructor
public class PoController extends BaseApiImpl<Po, PoDTO> {

    @Autowired
    PoService poService;

    @Autowired
    PoRepository poRepository;

    @Override
    protected BaseService getBaseService() {
        return poService;
    }

    @Override
    @Cacheable(value = "getAllPO")
    public ListResponse<PoDTO> getAll() {
        return super.getAll();
    }

    @Override
    @CacheEvict(value = {"getAllPO", "getPoByPage"}, allEntries = true)
    public DataResponse<PoDTO> add(@Valid PoDTO objectDTO) {
        return (poService.validateAddPO(objectDTO) == null) ? super.add(objectDTO) : poService.validateAddPO(objectDTO);
    }

    @Override
    @CacheEvict(value = {"getAllPO", "getPoByPage"}, allEntries = true)
    public DataResponse<PoDTO> update(@Valid PoDTO objectDTO, String key) {
        return (poService.validateUpdatePo(objectDTO, key) == null) ? super.update(objectDTO, key) : poService.validateUpdatePo(objectDTO, key);
    }

    @GetMapping(value = "/{poNumber}")
    public DataResponse<HashMap<String, HashMap<String, Integer>>> getStatisticsByPoNumber(@PathVariable("poNumber") String poNumber) {
        return poService.getStatisticsByPoNumber(poNumber);
    }

    @Override
    public ListResponse<PoDTO> searchByKeyword(SearchKeywordDto searchKeywordDto) {
        return super.searchByKeyword(searchKeywordDto);
    }

    @Override
    @Cacheable(value = "getPoByPage")
    public ListResponse<PoDTO> getAllByPage(int page, int size) {
        return super.getAllByPage(page, size);
    }

    /*Use For Swagger*/
    @Hidden
    @Override
    public DataResponse<PoDTO> getById(String id) {
        return null;
    }
    @Hidden
    @Override
    public DataResponse<PoDTO> delete(String id) {
        return null;
    }
    @Hidden
    @Override
    public ListResponse<PoDTO> getByIds(String ids) {
        return null;
    }
    @Hidden
    @Override
    public ListResponse<Po> getAllByKeyword(String keyword) {
        return null;
    }
}
