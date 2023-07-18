package com.ocena.qlsc.podetail.repository;

import com.ocena.qlsc.common.repository.BaseRepository;
import com.ocena.qlsc.podetail.model.PoDetail;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PoDetailRepository extends BaseRepository<PoDetail> {
//    @Cacheable(value = "findByPoDetailId")
    Optional<PoDetail> findByPoDetailId(String poDetailId);

    @Query("Select count(pd) from PoDetail pd where pd.po.poNumber = ?1")
    Long countByPoNumber(String poNumber);

    @Query("SELECT po FROM PoDetail po WHERE (CAST(po.product.productId AS string) LIKE %:keyword1% OR :keyword1 IS NULL)" +
            "AND (po.serialNumber LIKE %:keyword2% OR :keyword2 IS NULL)" +
            "AND (po.po.poNumber LIKE %:keyword3% OR :keyword3 IS NULL)" +
            "AND (po.bbbgNumberExport LIKE %:keyword4% OR :keyword4 IS NULL)" +
            "AND (DATE_FORMAT(FROM_UNIXTIME(po.importDate/1000),'%d/%m/%Y') LIKE %:keyword5% OR :keyword5 IS NULL)" +
            "AND (CAST(po.repairCategory AS string) LIKE %:keyword6% OR :keyword6 IS NULL)" +
            "AND (CAST(po.repairStatus AS string) LIKE %:keyword7% OR :keyword7 IS NULL)" +
            "AND (DATE_FORMAT(FROM_UNIXTIME(po.exportPartner/1000),'%d/%m/%Y')  LIKE %:keyword8% OR :keyword8 IS NULL)" +
            "AND (CAST(po.kcsVT AS string) LIKE %:keyword9% OR :keyword9 IS NULL)" +
            "AND (CAST(po.priority AS string) LIKE %:keyword10% OR :keyword10 IS NULL)")
    Page<PoDetail> searchPoDetail(@Param("keyword1") String keyword1,
                                  @Param("keyword2") String keyword2,
                                  @Param("keyword3") String keyword3,
                                  @Param("keyword4") String keyword4,
                                  @Param("keyword5") String keyword5,
                                  @Param("keyword6") String keyword6,
                                  @Param("keyword7") String keyword7,
                                  @Param("keyword8") String keyword8,
                                  @Param("keyword9") String keyword9,
                                  @Param("keyword10") String keyword10,
                                  Pageable pageable);

//    @Cacheable(value = "po-detail")
    @Override
    Page<PoDetail> findAll(Pageable pageable);

    @Query("select pd from PoDetail pd where pd.po.poNumber = ?1")
    List<PoDetail> findByPoNumber(String poNumber);

    List<PoDetail> findBySerialNumberIn(List<String> serialNumbers);

    List<PoDetail> getPoDetailsBySerialNumber(String serialNumbers);
}
