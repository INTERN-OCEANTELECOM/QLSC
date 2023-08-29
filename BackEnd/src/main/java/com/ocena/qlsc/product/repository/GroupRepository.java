package com.ocena.qlsc.product.repository;

import com.ocena.qlsc.product.model.ProductGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupRepository extends JpaRepository<ProductGroup, String> {
}
