package com.ocena.qlsc.product.model;

import com.ocena.qlsc.common.model.BaseModel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;
import java.util.Arrays;
import java.util.UUID;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(
        name = "product_image"
)
public class ProductImage {
    @Id
    private String id;
    @Lob
    @Column(name = "file_bytes", columnDefinition = "MEDIUMBLOB")
    private byte[] fileBytes;
    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "product_id")
    private Product product;

    public ProductImage(byte[] fileBytes, Product product) {
        this.fileBytes = fileBytes;
        this.product = product;
    }

    @PrePersist
    private void ensureId() {
        this.setId(UUID.randomUUID().toString());
    }

    @Override
    public String toString() {
        return "ProductImage{" +
                "id='" + id + '\'' +
                ", fileBytes=" + Arrays.toString(fileBytes) +
                '}';
    }
}
