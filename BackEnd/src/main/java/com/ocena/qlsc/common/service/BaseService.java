package com.ocena.qlsc.common.service;


import com.ocena.qlsc.common.dto.SearchKeywordDto;
import com.ocena.qlsc.common.response.DataResponse;
import com.ocena.qlsc.common.response.ListResponse;
import jakarta.transaction.Transactional;

import java.util.List;

public interface BaseService<E, Q, R> {
    DataResponse<R> create(Q dto);

    @Transactional
    DataResponse<R> addAll(List<Q> dto);
    @Transactional
    @SuppressWarnings("unchecked")
    DataResponse<R> update(String key, Q dto);
    @Transactional
    @SuppressWarnings("unchecked")
    DataResponse<R> delete(String id);

    @SuppressWarnings("unchecked")
    DataResponse<R> getById(String id);

    @SuppressWarnings("unchecked")
    ListResponse<R> getByIds(String ids);

    ListResponse<R> getAll();

    ListResponse<E> getAllByKeyword(String keyword);

    ListResponse<R> searchByKeyword(SearchKeywordDto searchKeywordDto);

    List<String> validationRequest (Object object);

    ListResponse<R> getAllByPage(int page, int size);
}
