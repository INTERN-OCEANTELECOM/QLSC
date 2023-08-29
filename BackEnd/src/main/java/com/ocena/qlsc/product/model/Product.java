package com.ocena.qlsc.product.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ocena.qlsc.common.model.BaseModel;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.io.Serializable;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(
        name = "product",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "product_id", name = "uq_product_productId")
        },
        indexes = {
                @Index(columnList = "product_id", name = "idx_product_product_id")
        }
)
public class Product extends BaseModel {
    @Column(name = "product_id", length = 100)
    private String productId;

    @Column(name = "product_name", length = 500)
    private String productName;

    @ManyToOne(targetEntity = ProductGroup.class, fetch = FetchType.EAGER)
    @JoinColumn(name = "product_group", foreignKey = @ForeignKey(name = "fk_product_product_groups"))
    private ProductGroup productGroup;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> images;
}
