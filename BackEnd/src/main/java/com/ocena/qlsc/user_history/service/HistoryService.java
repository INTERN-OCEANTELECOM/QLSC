package com.ocena.qlsc.user_history.service;

import com.ocena.qlsc.common.util.SystemUtil;
import com.ocena.qlsc.common.response.ListResponse;
import com.ocena.qlsc.common.response.ResponseMapper;
import com.ocena.qlsc.user_history.dto.HistoryDTO;
import com.ocena.qlsc.user_history.mapper.HistoryMapper;
import com.ocena.qlsc.user_history.enums.Action;
import com.ocena.qlsc.user_history.model.History;
import com.ocena.qlsc.user_history.repository.HistoryRepository;
import com.ocena.qlsc.user_history.utils.FileUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HistoryService {
    @Autowired
    HistoryRepository historyRepository;

    @Autowired
    HistoryMapper historyMapper;

    public ListResponse<HistoryDTO> getAll(){
        List<History> historyList = historyRepository.findAll();
        List<HistoryDTO> historyDTOList = historyList.stream()
                .map(history -> historyMapper.convertTo(history, HistoryDTO.class)).collect(Collectors.toList());

        return ResponseMapper.toListResponseSuccess(historyDTOList);
    }

    public void save(String action, String object, String description, String email, String filePath) {
        if(action.equals(Action.DELETE.getValue()) ||
                action.equals(Action.RESET_PASSWORD.getValue()) ||
                !description.equals("") ) {
            History history = new History();
            history.setAction(action);
            history.setObject(object);
            history.setDescription(description);
            if(email.equals(""))
                history.setEmail(SystemUtil.getCurrentEmail());
            else {
                history.setEmail(email);
            }
            if(filePath != null) {
                history.setFilePath(filePath);
            }
            historyRepository.save(history);
        }
    }

    public ListResponse<HistoryDTO> getByCreatedBetween(Long start, Long end){
        List<History> historyList = historyRepository.getAllByCreatedBetween(start, end);

        List<HistoryDTO> historyDTOList = historyList.stream()
                .map(history -> historyMapper.convertTo(history, HistoryDTO.class)).collect(Collectors.toList());

        return ResponseMapper.toListResponseSuccess(historyDTOList);
    }

    public ResponseEntity<byte[]> downloadExcelFile(String filePath) {
        byte[] excelBytes = FileUtil.getBytesDataFromFilePath(filePath);
        if(excelBytes == null) {
            return ResponseEntity.notFound().build();
        }
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", filePath);
        return ResponseEntity.ok().header(String.valueOf(headers)).body(excelBytes);
    }
}
