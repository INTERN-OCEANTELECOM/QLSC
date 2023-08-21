package com.ocena.qlsc.repair_history.mapper;

import com.ocena.qlsc.common.model.BaseMapperImpl;
import com.ocena.qlsc.repair_history.dto.RepairHistoryRequest;
import com.ocena.qlsc.repair_history.dto.RepairHistoryResponse;
import com.ocena.qlsc.repair_history.model.RepairHistory;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class RepairHistoryMapper extends BaseMapperImpl<RepairHistory, RepairHistoryRequest, RepairHistoryResponse> {
    public RepairHistoryMapper(ModelMapper modelMapper) {
        super(modelMapper);
    }
    @Override
    protected Class<RepairHistory> getEntityClass() {
        return RepairHistory.class;
    }
    @Override
    protected Class<RepairHistoryRequest> getRequestClass() {
        return RepairHistoryRequest.class;
    }
    @Override
    protected Class<RepairHistoryResponse> getResponseClass() {
        return RepairHistoryResponse.class;
    }
}
