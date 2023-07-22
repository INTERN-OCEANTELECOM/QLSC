package com.ocena.qlsc.user_history.mapper;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HistoryMapper {
    private final ModelMapper modelMapper;
    public <T, U> U convertTo(T source, Class<U> targetClass) {
        return modelMapper.map(source, targetClass);
    }
}
