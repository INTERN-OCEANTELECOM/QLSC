package com.ocena.qlsc.repair_history.service;

import com.ocena.qlsc.common.constants.TimeConstants;
import com.ocena.qlsc.common.dto.SearchKeywordDto;
import com.ocena.qlsc.common.model.BaseMapper;
import com.ocena.qlsc.common.repository.BaseRepository;
import com.ocena.qlsc.common.response.ListResponse;
import com.ocena.qlsc.common.response.ResponseMapper;
import com.ocena.qlsc.common.service.BaseServiceImpl;
import com.ocena.qlsc.common.util.SystemUtils;
import com.ocena.qlsc.podetail.dto.PoDetailResponse;
import com.ocena.qlsc.podetail.mapper.PoDetailMapper;
import com.ocena.qlsc.podetail.model.PoDetail;
import com.ocena.qlsc.podetail.repository.PoDetailRepository;
import com.ocena.qlsc.podetail.service.PoDetailService;
import com.ocena.qlsc.repair_history.dto.RepairHistoryRequest;
import com.ocena.qlsc.repair_history.dto.RepairHistoryResponse;
import com.ocena.qlsc.repair_history.enumrate.RepairResults;
import com.ocena.qlsc.repair_history.mapper.RepairHistoryMapper;
import com.ocena.qlsc.repair_history.model.RepairHistory;
import com.ocena.qlsc.repair_history.repository.RepairHistoryRepository;
import com.ocena.qlsc.user_history.service.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class RepairHistoryService extends BaseServiceImpl<RepairHistory, RepairHistoryRequest, RepairHistoryResponse> implements IRepairHistoryService {

    @Autowired
    RepairHistoryRepository repairHistoryRepository;

    @Autowired
    RepairHistoryMapper repairHistoryMapper;

    @Autowired
    PoDetailMapper poDetailMapper;

    @Autowired
    HistoryService historyService;

    @Autowired
    PoDetailService poDetailService;

    @Autowired
    PoDetailRepository poDetailRepository;

    @Override
    protected BaseRepository<RepairHistory> getBaseRepository() {
        return repairHistoryRepository;
    }

    @Override
    protected BaseMapper<RepairHistory, RepairHistoryRequest, RepairHistoryResponse> getBaseMapper() {
        return repairHistoryMapper;
    }

    @Override
    protected Function<String, Optional<RepairHistory>> getFindByFunction() {
        return getBaseRepository()::findById;
    }

    @Override
    protected Class<RepairHistory> getEntityClass() {
        return RepairHistory.class;
    }

    private int countSerialWithAllIsOK(List<RepairHistory> repairHistories) {
        Map<String, Set<RepairResults>> serialNumberStatus = new HashMap<>();
        int count = 0;

        for (RepairHistory history : repairHistories) {
            serialNumberStatus.putIfAbsent(history.getPoDetail().getSerialNumber(), new HashSet<>());
            serialNumberStatus.get(history.getPoDetail().getSerialNumber()).add(history.getRepairResults());
        }

        for (String serial : serialNumberStatus.keySet()) {
            if (serialNumberStatus.get(serial).size() > 0
                    && serialNumberStatus.get(serial).stream()
                    .allMatch(repairResults -> repairResults == RepairResults.OK))
                count++;
        }

        return count;
    }

    private void filterByCreatorAndRepairResult(String creator, String repairResult, List<PoDetail> poDetails) {
        Iterator<PoDetail> iteratorPoDetail = poDetails.iterator();

        while (iteratorPoDetail.hasNext()) {
            PoDetail poDetail = iteratorPoDetail.next();
            Iterator<RepairHistory> iterator = poDetail.getRepairHistories().iterator();
            while (iterator.hasNext()) {
                RepairHistory repairHistory = iterator.next();
                if((creator == null || creator.equals(repairHistory.getCreator()))
                        && (repairResult == null || repairResult.equals(repairHistory.getRepairResults().toString()))) {
                    continue;
                }
                iterator.remove();
            }
            if(creator != null || repairResult != null) {
                if(poDetail.getRepairHistories().isEmpty()) {
                    iteratorPoDetail.remove();
                }
            }
        }
    }

    protected Page<PoDetailResponse> getPageResult(SearchKeywordDto searchKeywordDto, Pageable pageable) {
        String productName = searchKeywordDto.getKeyword().get(0);
        String serialNumber = searchKeywordDto.getKeyword().get(1);
        String poNumber = searchKeywordDto.getKeyword().get(2);
        String creator = searchKeywordDto.getKeyword().get(3);
        String repairResult = searchKeywordDto.getKeyword().get(4);

        Page<PoDetail> pageSearchRepairHistory = repairHistoryRepository
                .searchRepairHistory(serialNumber, poNumber, productName, pageable);

        List<PoDetail> poDetails = new ArrayList<>(pageSearchRepairHistory.getContent());

        filterByCreatorAndRepairResult(creator, repairResult, poDetails);

        List<PoDetailResponse> listPoDetailResponse = poDetails.stream().map(poDetail -> {
            PoDetailResponse poDetailResponse = poDetailMapper.entityToDto(poDetail);
            int amountInPO = poDetailRepository.countByProductIdAndPoNumber(poDetail.getProduct().getProductId(),
                    poDetail.getPo().getPoNumber());
            int countRepairIsOK = 0;
            List<RepairHistory> repairHistories = repairHistoryRepository.findByProductIdAndPoNumber(
                    poDetail.getProduct().getProductId(), poDetail.getPo().getPoNumber());
            countRepairIsOK = countSerialWithAllIsOK(repairHistories);
            poDetailResponse.setAmountInPo(amountInPO);
            poDetailResponse.setRemainingQuantity(amountInPO - countRepairIsOK);
            return poDetailResponse;
        }).collect(Collectors.toList());

        return new PageImpl<>(listPoDetailResponse, pageable, listPoDetailResponse.size());
    }

    public ListResponse<PoDetailResponse> getAllByListKeyword(SearchKeywordDto searchKeywordDto) {
        boolean allNullAndEmpty = searchKeywordDto.getKeyword()
                .stream()
                .allMatch(str -> str == null || str.trim().isEmpty());
        Pageable pageable = null;
        if (!allNullAndEmpty || searchKeywordDto.getProperty().equals("ALL")) {
            pageable = PageRequest.of(0, Integer.MAX_VALUE);
        } else {
            pageable = PageRequest.of(searchKeywordDto.getPageIndex(), searchKeywordDto.getPageSize());
        }
        return ResponseMapper.toPagingResponseSuccess(getPageResult(searchKeywordDto, pageable));
    }

    public boolean checkRepairTimeOut(List<RepairHistoryRequest> repairHistoryRequest){
        List<RepairHistory> repairHistoryList = repairHistoryRequest
                .stream().map(repairHistory -> {
                    if (repairHistory.getId() == null) {
                        return new RepairHistory(poDetailRepository.findById(repairHistory.getPoDetail().getId()).get());
                    } else {
                        return repairHistoryRepository.findById(repairHistory.getId()).orElse(null);
                    }
                }).toList();

        for (RepairHistory repairHistory : repairHistoryList) {
            if (repairHistory.getPoDetail().getPo().getEndAt() != null && repairHistory.getPoDetail().getPo().getEndAt() < SystemUtils.getCurrentTime()) {
                return false;
            }

            if (repairHistory.getId() != null) {
                if (!repairHistory.getRepairResults().name().equals(RepairResults.DANG_SC.name())
                        && repairHistory.getCreated() + TimeConstants.REPAIR_HISTORY_LIMIT_TIME < SystemUtils.getCurrentTime()) {
                    return false;
                }
            }
        }
        return true;
    }

    public ListResponse<RepairHistoryResponse> getRepairHistoryBySerialAndPoNumber(String poDetailId, String id) {
        PoDetail poDetail = poDetailRepository.findByPoDetailId(poDetailId).get();
        List<RepairHistory> repairHistoryList = poDetail.getRepairHistories();

        int amountInPO = poDetailRepository.countByProductIdAndPoNumber(poDetail.getProduct().getProductId(), poDetail.getPo().getPoNumber());
        List<RepairHistoryResponse> resultList = new ArrayList<>();
        if (repairHistoryList.isEmpty()) {
            PoDetailResponse poDetailResponse = poDetailMapper.entityToDto(poDetail);
            poDetailResponse.setAmountInPo(amountInPO);
            poDetailResponse.setRemainingQuantity(amountInPO);
            resultList.add(new RepairHistoryResponse(poDetailResponse));
        } else {
            int countSerialWithAllIsOK = countSerialWithAllIsOK(repairHistoryList);
            Optional<RepairHistory> optionalRepairHistory = repairHistoryRepository.findById(id);

            if(optionalRepairHistory.isPresent()){
                repairHistoryList.remove(optionalRepairHistory.get());
                repairHistoryList.add(0, optionalRepairHistory.get());
            }

            resultList = repairHistoryList.stream()
                    .map(repairHistory -> {
                        RepairHistoryResponse response = repairHistoryMapper.entityToDto(repairHistory);
                        response.getPoDetail().setAmountInPo(amountInPO);
                        response.getPoDetail().setRemainingQuantity(amountInPO - countSerialWithAllIsOK);
                        return response;
                    }).collect(Collectors.toList());
        }
        return ResponseMapper.toListResponseSuccess(resultList);
    }

    @Override
    protected Page<RepairHistoryResponse> getPageResults(SearchKeywordDto searchKeywordDto, Pageable pageable) {
        return null;
    }

    @Override
    protected List<RepairHistory> getListSearchResults(String keyword) {
        return null;
    }
}
