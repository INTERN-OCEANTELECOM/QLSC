package com.ocena.qlsc.user_history.repository;

import com.ocena.qlsc.common.repository.BaseRepository;
import com.ocena.qlsc.user_history.dto.HistoryDTO;
import com.ocena.qlsc.user_history.model.History;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoryRepository extends BaseRepository<History> {
    List<History> getAllByCreatedBetween(Long start, Long end);
}
