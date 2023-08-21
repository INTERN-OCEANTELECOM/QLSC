package com.ocena.qlsc.common.controller;

import com.ocena.qlsc.common.dto.SearchKeywordDto;
import com.ocena.qlsc.common.response.DataResponse;
import com.ocena.qlsc.common.response.ListResponse;
import com.ocena.qlsc.common.service.BaseService;
import com.ocena.qlsc.common.util.ApiResources;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

public abstract class BaseApiImpl<E, Q, R> implements BaseApi<E, Q, R> {
    protected abstract BaseService<E, Q, R> getBaseService();

    @Override
    @PostMapping(ApiResources.ADD)
    public DataResponse<R> add(@RequestBody Q objectDTO) {
        return this.getBaseService().create(objectDTO);
    }

    @Override
    @PostMapping(ApiResources.ADD_ALL)
    public DataResponse<R> addAll(List<Q> listDto) {
        return this.getBaseService().addAll(listDto);
    }

    @Override
    @PutMapping(ApiResources.UPDATE)
    public DataResponse<R> update(@RequestBody Q objectDTO,
                                  @PathVariable("key") String key) {
        return this.getBaseService().update(key, objectDTO);
    }

    @Override
    @GetMapping(ApiResources.GET_BY_ID)
    public DataResponse<R> getById(@RequestParam String id) {
        return this.getBaseService().getById(id);
    }

    @Override
    @PutMapping(ApiResources.DELETE)
    public DataResponse<R> delete(@PathVariable("id") String id) {
        return this.getBaseService().delete(id);
    }

    @Override
    @GetMapping(ApiResources.GET_ALL)
    public ListResponse<R> getAll() {
        return this.getBaseService().getAll();
    }

    @Override
    @GetMapping(ApiResources.GET_BY_IDS)
    public ListResponse<R> getByIds(@RequestParam String ids) {
        return this.getBaseService().getByIds(ids);
    }

    @Override
    @GetMapping(ApiResources.GET_ALL_BY_KEYWORD)
    public ListResponse<E> getAllByKeyword(@RequestParam String keyword) {
        return this.getBaseService().getAllByKeyword(keyword);
    }

    @Override
    @PostMapping(ApiResources.SEARCH_BY_KEYWORD)
    public ListResponse<R> searchByKeyword(@Valid @RequestBody SearchKeywordDto searchKeywordDto) {
        return this.getBaseService().searchByKeyword(searchKeywordDto);
    }

    @Override
    @GetMapping(ApiResources.GET_ALL_BY_PAGE)
    public ListResponse<R> getAllByPage(int page, int size) {
        return this.getBaseService().getAllByPage(page, size);
    }
}
