package com.ocena.qlsc.common.service;

import com.ocena.qlsc.common.dto.SearchKeywordDto;
import com.ocena.qlsc.common.model.BaseModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.function.Function;

public abstract class BaseServiceAdapter<E extends BaseModel, Q, R> extends BaseServiceImpl<E,Q,R>{

    @Override
    protected Function<String, Optional<E>> getFindByFunction() {
        return null;
    }

    @Override
    protected Page<R> getPageResults(SearchKeywordDto searchKeywordDto, Pageable pageable) {
        return null;
    }

    @Override
    protected List<E> getListSearchResults(String keyword) {
        return null;
    }
}
