package com.ocena.qlsc.po.model;

import com.ocena.qlsc.common.model.BaseModel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(
        name = "product_order",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "po_number", name = "uq_po_po_number")
        },
        indexes = {
                @Index(columnList = "po_number", name = "idx_po_po_number")
        }
)
public class Po extends BaseModel {
    @Column(name = "contract_number")
    private String contractNumber;
    @Column(name = "po_number")
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
    @Override
    public String toString() {
        return "Po{" +
                "contractNumber='" + contractNumber + '\'' +
                ", poNumber='" + poNumber + '\'' +
                ", quantity=" + quantity +
                ", beginAt=" + beginAt +
                ", endAt=" + endAt +
                ", note='" + note + '\'' +
                ", warrantyExpirationDate=" + warrantyExpirationDate +
                ", contractWarrantyExpirationDate=" + contractWarrantyExpirationDate +
                '}' + super.toString();
    }
}
