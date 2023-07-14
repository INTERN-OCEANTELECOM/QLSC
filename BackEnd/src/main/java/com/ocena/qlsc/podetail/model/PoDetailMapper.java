package com.ocena.qlsc.podetail.model;

import com.ocena.qlsc.common.model.BaseMapperImpl;
import com.ocena.qlsc.podetail.dto.PoDetailResponse;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class PoDetailMapper extends BaseMapperImpl<PoDetail, PoDetailResponse> {
    public PoDetailMapper(ModelMapper modelMapper) {
        super(modelMapper);
    }

    @Override
    protected Class<PoDetail> getEntityClass() {
        return PoDetail.class;
    }

    @Override
    protected Class<PoDetailResponse> getDtoClass() {
        return PoDetailResponse.class;
    }
}
