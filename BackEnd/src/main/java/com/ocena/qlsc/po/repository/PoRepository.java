package com.ocena.qlsc.po.repository;

import com.ocena.qlsc.common.repository.BaseRepository;
import com.ocena.qlsc.po.model.Po;

import com.ocena.qlsc.podetail.model.PoDetail;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PoRepository extends BaseRepository<Po> {

    Optional<Po> findByPoNumber(String poNumber);

    Optional<Po> findById(String id);

    @Query(value = "select pd from PoDetail pd where pd.po.poNumber =:poNumber")
    List<PoDetail> getPoDetailsByPoNumber(String poNumber);
}