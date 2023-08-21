package com.ocena.qlsc.repair_history.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ocena.qlsc.podetail.dto.PoDetailRequest;
import com.ocena.qlsc.podetail.dto.PoDetailResponse;
import com.ocena.qlsc.podetail.model.PoDetail;
import com.ocena.qlsc.repair_history.enumrate.RepairResults;
import lombok.*;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RepairHistoryResponse implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    private String id;
    private String module;
    private RepairResults repairResults;
    private String accessory;
    private String repairError;
    private Long repairDate;
    private String creator;
    private PoDetailResponse poDetail;

    public RepairHistoryResponse(PoDetailResponse poDetailResponse) {
        this.poDetail = poDetailResponse;
    }

    public PoDetailResponse getPoDetail() {
        poDetail.setRepairHistories(null);
        return poDetail;
    }
}
