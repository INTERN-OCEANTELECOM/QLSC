package com.ocena.qlsc.po.service;

import com.ocena.qlsc.common.error.exception.DataAlreadyExistException;
import com.ocena.qlsc.common.error.exception.FunctionLimitedTimeException;
import com.ocena.qlsc.common.error.exception.InvalidTimeException;
import com.ocena.qlsc.common.error.exception.ResourceNotFoundException;
import com.ocena.qlsc.common.constants.TimeConstants;
import com.ocena.qlsc.common.dto.SearchKeywordDto;
import com.ocena.qlsc.common.constants.message.StatusCode;
import com.ocena.qlsc.common.constants.message.StatusMessage;
import com.ocena.qlsc.common.model.BaseMapper;
import com.ocena.qlsc.common.repository.BaseRepository;
import com.ocena.qlsc.common.response.DataResponse;
import com.ocena.qlsc.common.response.ResponseMapper;
import com.ocena.qlsc.common.service.BaseServiceAdapter;
import com.ocena.qlsc.po.dto.PoRequest;
import com.ocena.qlsc.po.dto.PoResponse;
import com.ocena.qlsc.po.mapper.PoMapper;
import com.ocena.qlsc.po.model.Po;
import com.ocena.qlsc.po.repository.PoRepository;
import com.ocena.qlsc.podetail.enumrate.KcsVT;
import com.ocena.qlsc.podetail.enumrate.RepairStatus;
import com.ocena.qlsc.podetail.model.PoDetail;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class PoService extends BaseServiceAdapter<Po, PoRequest, PoResponse> implements IPoService {
    @Autowired
    PoRepository poRepository;
    @Autowired
    PoMapper poMapper;
    @Override
    protected BaseRepository<Po> getBaseRepository() {
        return poRepository;
    }
    @Override
    protected BaseMapper<Po, PoRequest, PoResponse> getBaseMapper() {
        return poMapper;
    }
    @Override
    protected Function<String, Optional<Po>> getFindByFunction() {
        return poRepository::findByPoNumber;
    }
    @Override
    protected Class<Po> getEntityClass() {
        return Po.class;
    }
    @Override
    public Logger getLogger() {
        return super.getLogger();
    }
    @Override
    protected Page<PoResponse> getPageResults(SearchKeywordDto searchKeywordDto, Pageable pageable) {
        return poRepository.searchPO(
                searchKeywordDto.getKeyword().get(0).trim(),
                pageable).map(po -> poMapper.entityToDto(po));
    }

    public void validateUpdatePo(PoRequest poRequest, String key) {
        if (poRequest.getBeginAt() != null && poRequest.getEndAt() != null && poRequest.getBeginAt() > poRequest.getEndAt()) {
            throw new InvalidTimeException("Invalid Time");
        }

        Optional<Po> optionalPo = poRepository.findByPoNumber(key);
        if(optionalPo.isEmpty()) {
            throw new ResourceNotFoundException("Not Found");
        }
        Po oldPo = optionalPo.get();

        if (oldPo.getCreated() + TimeConstants.PO_UPDATE_TIME < System.currentTimeMillis()
                && (!oldPo.getPoNumber().equals(poRequest.getPoNumber())
                || !oldPo.getContractNumber().equals(poRequest.getContractNumber()))) {
            throw new FunctionLimitedTimeException("Execution time over");
        }
        if (poRepository.existsByPoNumber(poRequest.getPoNumber()) && !poRequest.getPoNumber().equals(key)){
            throw new DataAlreadyExistException(poRequest.getPoNumber() + " already exist");
        }
    }

    /**
     * Groups the PoDetail objects in the given list by a Short property extracted by the given function,
     * and returns a map of the counts of objects in each group, mapped to their corresponding Enum values
     * @param list the list of PoDetail objects to group
     * @param propertyGetter the function to extract the Short property from each PoDetail object
     * @param enums the Enum class to use for mapping the counts to Enum values
     * @param values the Short values to use for mapping the counts to Enum values or a special value
     * @return a map of the counts of objects in each group, mapped to their corresponding Enum values or special value
     */
    private static <E extends Enum<E>> Map<String, Long> getCountsByProperty(List<PoDetail> list, Function<PoDetail, Short> propertyGetter, E enums, Short... values) {
        // Group the PoDetail objects by the Short property extracted by the given function
        Map<Short, Long> countsByProperty = list.stream()
                .collect(Collectors.groupingBy(detail -> propertyGetter.apply(detail) == null
                        ? (short) -1 : propertyGetter.apply(detail).shortValue(), Collectors.counting()));

        // Create a new map to store the counts mapped to their corresponding Enum values or special value
        Map<String, Long> result = new HashMap<>();
        E[] enumConstant = (E[]) enums.getClass().getEnumConstants();

        for (Short value: values) {
            if(value == -1) {
                result.put("CHUA_CAP_NHAT", countsByProperty.getOrDefault(value, 0L));
            } else {
                result.put(enumConstant[value].name(), countsByProperty.getOrDefault(value, 0L));
            }
        }
        return result;
    }

    public static Map<String, Long> getCountsByRepairStatus(List<PoDetail> list, RepairStatus repairStatus) {
        return getCountsByProperty(list, PoDetail::getRepairStatus, repairStatus, (short) 0, (short) 1, (short) 2, (short) -1);
    }
    public static Map<String, Long> getCountsByKSCVT(List<PoDetail> list, KcsVT kscvt) {
        return getCountsByProperty(list, PoDetail::getKcsVT, kscvt, (short) 0, (short) 1, (short) -1);
    }

    public static Map<String, Long> getCountsByWarrantyPeriod(List<PoDetail> list) {
        long countUpdatedWarrantyPeriod = list.stream().filter(poDetail -> poDetail.getWarrantyPeriod() != null).count();

        Map<String, Long> result = new HashMap<>();
        result.put("DA_CAP_NHAT", countUpdatedWarrantyPeriod);
        result.put("CHUA_CAP_NHAT", (long) list.size() - countUpdatedWarrantyPeriod);
        return result;
    }

    public static Map<String, Long> getCountsByExportPartner(List<PoDetail> list) {
        long countUpdatedExportPartner = list.stream().filter(poDetail -> poDetail.getExportPartner() != null).count();

        Map<String, Long> result = new HashMap<>();
        result.put("DA_CAP_NHAT", countUpdatedExportPartner);
        result.put("CHUA_CAP_NHAT", (long) list.size() - countUpdatedExportPartner);
        return result;
    }

    /**
     * Gets various statistics on the PoDetail objects associated with the Po with the given poNumber,
     * @param poNumber the poNumber of the Po to get statistics for
     * @return a DataResponse containing the statistics and a status code and message
     */
    public DataResponse<HashMap<String, HashMap<String, Integer>>> getStatisticsByPoNumber(String poNumber) {
        // Check if a Po object with the given poNumber exists in the repository
        Optional<Po> optionalPO = poRepository.findByPoNumber(poNumber);

        // Create a new map to store the results of the statistics
        HashMap<String, Map<String, Long>> resultsMap = new HashMap<>();
        List<PoDetail> listPoDetail = poRepository.getPoDetailsByPoNumber(poNumber);
        if(optionalPO.isPresent()) {
            Po po = optionalPO.get();
            Map<String, Long> totalMap = new HashMap<>();
            totalMap.put("TONG", (long) po.getQuantity());
            totalMap.put("SO_LUONG_IMPORT", (long) listPoDetail.size());
            resultsMap.put("TONG_SO_LUONG", totalMap);


            resultsMap.put("TRANG_THAI_SC", getCountsByRepairStatus(listPoDetail, RepairStatus.SC_XONG));
            resultsMap.put("KSC_VT", getCountsByKSCVT(listPoDetail, KcsVT.PASS));
            resultsMap.put("BAO_HANH", getCountsByWarrantyPeriod(listPoDetail));
            resultsMap.put("XUAT_KHO", getCountsByExportPartner(listPoDetail));
            return ResponseMapper.toDataResponse(resultsMap, StatusCode.REQUEST_SUCCESS, StatusMessage.REQUEST_SUCCESS);
        }
        return ResponseMapper.toDataResponse(null, StatusCode.DATA_NOT_FOUND, StatusMessage.DATA_NOT_FOUND);
    }
}
