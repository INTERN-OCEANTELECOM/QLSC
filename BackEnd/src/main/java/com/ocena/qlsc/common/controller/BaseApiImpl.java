package com.ocena.qlsc.common.controller;

import com.ocena.qlsc.common.dto.SearchKeywordDto;
import com.ocena.qlsc.common.response.DataResponse;
import com.ocena.qlsc.common.response.ListResponse;
import com.ocena.qlsc.common.service.BaseService;
import com.ocena.qlsc.common.util.ApiResources;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

public abstract class BaseApiImpl<E, D> implements BaseApi<E, D> {
    protected abstract BaseService<E, D> getBaseService();

    @Override
    @PostMapping(ApiResources.ADD)
    public DataResponse<D> add(@RequestBody D objectDTO) {
        return this.getBaseService().create(objectDTO);
    }

    @Override
    @PutMapping(ApiResources.UPDATE)
    public DataResponse<D> update(@RequestBody D objectDTO,
                                  @PathVariable("key") String key) {
        return this.getBaseService().update(key, objectDTO);
    }

    @Override
    @GetMapping(ApiResources.GET_BY_ID)
    public DataResponse<D> getById(@RequestParam String id) {
        return this.getBaseService().getById(id);
    }

    @Override
    @PutMapping(ApiResources.DELETE)
    public DataResponse<D> delete(@PathVariable("id") String id) {
        return this.getBaseService().delete(id);
    }

    @Override
    @GetMapping(ApiResources.GET_ALL)
    public ListResponse<D> getAll() {
        return this.getBaseService().getAll();
    }

    @Override
    @GetMapping(ApiResources.GET_BY_IDS)
    public ListResponse<D> getByIds(@RequestParam String ids) {
        return this.getBaseService().getByIds(ids);
    }

    @Override
    @GetMapping(ApiResources.GET_ALL_BY_KEYWORD)
    public ListResponse<E> getAllByKeyword(@RequestParam String keyword) {
        return this.getBaseService().getAllByKeyword(keyword);
    }

    @Override
    @PostMapping(ApiResources.SEARCH_BY_KEYWORD)
    public ListResponse<D> searchByKeyword(@Valid @RequestBody SearchKeywordDto searchKeywordDto) {
        return this.getBaseService().searchByKeyword(searchKeywordDto);
    }

    @Override
    @GetMapping(ApiResources.GET_ALL_BY_PAGE)
    public ListResponse<D> getAllByPage(int page, int size) {
        return this.getBaseService().getAllByPage(page, size);
    }
}
