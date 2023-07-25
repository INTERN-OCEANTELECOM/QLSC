package com.ocena.qlsc.common.service;


import com.ocena.qlsc.common.dto.ChangeStatusDto;
import com.ocena.qlsc.common.dto.SearchKeywordDto;
import com.ocena.qlsc.common.response.DataResponse;
import com.ocena.qlsc.common.response.ListResponse;
import jakarta.transaction.Transactional;

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;

public interface BaseService<E, D> {
    DataResponse<D> create(D dto);

    @Transactional
    @SuppressWarnings("unchecked")
    DataResponse<D> update(String key, D dto);
    @Transactional
    @SuppressWarnings("unchecked")
    DataResponse<D> delete(String id);

    @SuppressWarnings("unchecked")
    DataResponse<D> getById(String id);

    @SuppressWarnings("unchecked")
    ListResponse<D> getByIds(String ids);

    ListResponse<D> getAll();

    ListResponse<E> getAllByKeyword(String keyword);

    ListResponse<E> searchByKeyword(SearchKeywordDto searchKeywordDto);

    List<String> validationRequest (Object object);

    ListResponse<D> getAllByPage(int page, int size);
}
