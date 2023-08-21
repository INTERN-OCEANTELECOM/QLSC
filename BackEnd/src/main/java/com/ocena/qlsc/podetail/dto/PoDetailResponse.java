package com.ocena.qlsc.podetail.dto;

import com.ocena.qlsc.po.dto.PoRequest;
import com.ocena.qlsc.product.dto.product.ProductRequest;
import com.ocena.qlsc.repair_history.dto.RepairHistoryResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PoDetailResponse implements Serializable {
    @Serial
    private static final long serialVersionUID = 222218718908L;
    private String id;
    private String poDetailId;
    private ProductRequest product;
    private String serialNumber;
    private PoRequest po;
    private Long importDate;
    private Short repairCategory;
    private Short repairStatus;
    private Long exportPartner;
    private Short kcsVT;
    private Long warrantyPeriod;
    private Short priority;
    private String bbbgNumberExport;
    private String note;
    private List<RepairHistoryResponse> repairHistories;
    private Integer amountInPo;
    private Integer remainingQuantity;
}
