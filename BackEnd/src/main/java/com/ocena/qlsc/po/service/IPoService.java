package com.ocena.qlsc.po.service;

import com.ocena.qlsc.common.response.DataResponse;
import com.ocena.qlsc.common.service.BaseService;
import com.ocena.qlsc.po.dto.PoDTO;
import com.ocena.qlsc.po.model.Po;

public interface IPoService extends BaseService<Po, PoDTO> {
    DataResponse<PoDTO> validationPoRequest(PoDTO poDTO, boolean isUpdate, String key);
}
