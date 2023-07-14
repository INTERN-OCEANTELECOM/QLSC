package com.ocena.qlsc.po.model;

import com.ocena.qlsc.common.model.BaseModel;
import com.ocena.qlsc.common.util.SystemUtil;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "product_order")
public class Po extends BaseModel implements Serializable {

    @Column(name = "contract_number")
    private String contractNumber;
    @Column(name = "po_number", unique = true)
    private String poNumber;
    @Column(name = "quantity")
    private Integer quantity;
    @Column(name = "begin_at")
    private Long beginAt;
    @Column(name = "end_at")
    private Long endAt;

    @Column(length = 401)
    private String note;

    @Column(name = "warranty_expiration_date")
    private Long warrantyExpirationDate;

    @Column(name = "contract_warranty_expiration_date")
    private Long contractWarrantyExpirationDate;

    public Po(String poNumber) {
        this.poNumber = poNumber;
    }

    @Override
    public String toString() {
        return "Po{" +
                "poNumber='" + poNumber + '\'' +
                ", quantity=" + quantity +
                ", beginAt=" + beginAt +
                ", endAt=" + endAt +
                '}';
    }
}
