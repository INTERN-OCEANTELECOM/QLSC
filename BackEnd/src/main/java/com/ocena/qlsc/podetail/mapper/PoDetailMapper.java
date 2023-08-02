package com.ocena.qlsc.podetail.mapper;

import com.ocena.qlsc.common.model.BaseMapperImpl;
import com.ocena.qlsc.podetail.dto.PoDetailDTO;
import com.ocena.qlsc.podetail.model.PoDetail;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class PoDetailMapper extends BaseMapperImpl<PoDetail, PoDetailDTO> {
    public PoDetailMapper(ModelMapper modelMapper) {
        super(modelMapper);
    }

    @Override
    protected Class<PoDetail> getEntityClass() {
        return PoDetail.class;
    }

    @Override
    protected Class<PoDetailDTO> getDtoClass() {
        return PoDetailDTO.class;
    }
}
