package com.ocena.qlsc.podetail.mapper;

import com.ocena.qlsc.common.model.BaseMapperImpl;
import com.ocena.qlsc.podetail.dto.PoDetailRequest;
import com.ocena.qlsc.podetail.dto.PoDetailResponse;
import com.ocena.qlsc.podetail.model.PoDetail;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class PoDetailMapper extends BaseMapperImpl<PoDetail, PoDetailRequest, PoDetailResponse> {
    public PoDetailMapper(ModelMapper modelMapper) {
        super(modelMapper);
    }

    @Override
    protected Class<PoDetail> getEntityClass() {
        return PoDetail.class;
    }

    @Override
    protected Class<PoDetailRequest> getRequestClass() {
        return PoDetailRequest.class;
    }

    @Override
    protected Class<PoDetailResponse> getResponseClass() {
        return PoDetailResponse.class;
    }
}
