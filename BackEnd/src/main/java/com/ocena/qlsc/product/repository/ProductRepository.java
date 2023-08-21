package com.ocena.qlsc.product.repository;

import com.ocena.qlsc.common.repository.BaseRepository;
import com.ocena.qlsc.product.model.Product;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends BaseRepository<Product> {
    Page<Product> findAll(Pageable pageable);

    @Cacheable("findAllProduct")
    List<Product> findAll();

    boolean existsProductByProductId(String productId);

    @Query("SELECT p FROM Product p WHERE p.productName LIKE %:keyword%")
    Page<Product> searchProduct(@Param("keyword") String keyword, Pageable pageable);

    Optional<Product> findByProductId(String productId);

    @Query(""" 
                select p.productId, p.productName, count(pd.product.productId) 
                from Product p LEFT JOIN PoDetail pd on p.productId = pd.product.productId 
                group by p.productId, p.productName
           """)
    Page<Object[]> getProductPageable(Pageable pageable);

    @Query("select distinct p.productName from Product p")
    List<String> getAllProductName();

}