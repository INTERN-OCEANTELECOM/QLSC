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

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "product")
public class Product extends BaseModel implements Serializable{
    @Column(name = "product_id", unique = true, length = 100)
    private String productId;

    @Column(name = "product_name")
    private String productName;


    public Product(String productId) {
        this.productId = productId;
    }
}
