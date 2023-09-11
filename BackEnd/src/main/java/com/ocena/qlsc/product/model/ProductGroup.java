package com.ocena.qlsc.product.model;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;
import java.util.Set;

@Entity
@NoArgsConstructor
@Table(
        name = "product_group",
        indexes = {
                @Index(columnList = "group_name", name = "idx_product_group_name")
        },
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "group_name", name = "uq_product_group_name")
        }
)
@Getter
@Setter
@AllArgsConstructor
public class ProductGroup implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    @Id
    private String id;
    @Column(name = "group_name")
    private String groupName;
    @OneToMany(mappedBy = "productGroup")
    private List<Product> productList;
    public ProductGroup(String id) {
        this.id = id;
    }
}
