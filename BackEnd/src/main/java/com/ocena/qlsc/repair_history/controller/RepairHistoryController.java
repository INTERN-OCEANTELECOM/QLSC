package com.ocena.qlsc.repair_history.controller;

import com.ocena.qlsc.common.annotation.ApiShow;
import com.ocena.qlsc.common.constants.message.StatusCode;
import com.ocena.qlsc.common.constants.message.StatusMessage;
import com.ocena.qlsc.common.controller.BaseApiImpl;
import com.ocena.qlsc.common.dto.SearchKeywordDto;
import com.ocena.qlsc.common.response.DataResponse;
import com.ocena.qlsc.common.response.ListResponse;
import com.ocena.qlsc.common.response.ResponseMapper;
import com.ocena.qlsc.common.service.BaseService;
import com.ocena.qlsc.podetail.dto.PoDetailResponse;
import com.ocena.qlsc.repair_history.dto.RepairHistoryRequest;
import com.ocena.qlsc.repair_history.dto.RepairHistoryResponse;
import com.ocena.qlsc.repair_history.model.RepairHistory;
import com.ocena.qlsc.repair_history.service.RepairHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/repair-history")
public class RepairHistoryController extends BaseApiImpl<RepairHistory, RepairHistoryRequest, RepairHistoryResponse> {

    @Autowired
    RepairHistoryService repairHistoryService;

    @Override
    protected BaseService<RepairHistory, RepairHistoryRequest, RepairHistoryResponse> getBaseService() {
        return repairHistoryService;
    }

    @Override
    @ApiShow
    public DataResponse<RepairHistoryResponse> addAll(List<RepairHistoryRequest> listDto) {
        if(repairHistoryService.checkRepairTimeOut(listDto)) {
            return super.addAll(listDto);
        }
        return ResponseMapper.toDataResponse("Repair time out", StatusCode.DATA_NOT_MAP, StatusMessage.DATA_NOT_MAP);
    }

    /**
     * get Data RepairHistory By SerialNumber and PoNumber
     * @param poDetailId PoDetailId = PoNumber-ProductId-SerialNumber
     * @return
     */
    @ApiShow
    @GetMapping("/get-related-data")
    public ListResponse<RepairHistoryResponse> getRepairHistoryBySerialAndPoNumber(@RequestParam("poDetailId") String poDetailId, @RequestParam("id") String id){
        return repairHistoryService.getRepairHistoryBySerialAndPoNumber(poDetailId, id);
    }

    @ApiShow
    @PostMapping("/search-by-list-keywords")
    public ListResponse<PoDetailResponse> searchByKeywords(@RequestBody SearchKeywordDto searchKeywordDto) {
        return repairHistoryService.getAllByListKeyword(searchKeywordDto);
    }
}
