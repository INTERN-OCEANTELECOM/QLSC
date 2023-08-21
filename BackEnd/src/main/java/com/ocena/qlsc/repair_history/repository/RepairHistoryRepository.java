package com.ocena.qlsc.repair_history.repository;

import com.ocena.qlsc.common.repository.BaseRepository;
import com.ocena.qlsc.podetail.model.PoDetail;
import com.ocena.qlsc.repair_history.enumrate.RepairResults;
import com.ocena.qlsc.repair_history.model.RepairHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface RepairHistoryRepository extends BaseRepository<RepairHistory> {
    @Query("""
                SELECT pd FROM PoDetail pd
                WHERE (:serialNumber IS NULL OR pd.serialNumber LIKE %:serialNumber%)
                AND (:poNumber IS NULL OR pd.po.poNumber LIKE %:poNumber%)
                AND (:productName IS NULL OR pd.product.productName LIKE %:productName%)
          """)
    Page<PoDetail> searchRepairHistory(@Param("serialNumber") String serialNumber,
                                       @Param("poNumber") String poNumber,
                                       @Param("productName") String productName,
                                       Pageable pageable);

//    @Query("""
//                SELECT pd FROM RepairHistory rh right join PoDetail pd on rh.poDetail.id = pd.id
//                WHERE (:serialNumber IS NULL OR pd.serialNumber LIKE %:serialNumber%)
//                AND (:poNumber IS NULL OR pd.po.poNumber LIKE %:poNumber%)
//                AND (:productName IS NULL OR pd.product.productName LIKE %:productName%)
//                AND ((:creator IS NULL OR rh.creator LIKE %:creator%)
//                AND (:repairResult IS NULL OR rh.repairResults = :repairResult))
//          """)
//    Page<PoDetail> searchRepairHistory(@Param("serialNumber") String serialNumber,
//                                       @Param("poNumber") String poNumber,
//                                       @Param("productName") String productName,
//                                       @Param("creator") String creator,
//                                       @Param("repairResult") RepairResults repairResult,
//                                       Pageable pageable);

    @Query("""
                SELECT rh
                FROM RepairHistory rh WHERE rh.poDetail.poDetailId = :poDetailId
            """)
    List<RepairHistory> findByPoDetailId(@Param("poDetailId") String poDetailId);

}
