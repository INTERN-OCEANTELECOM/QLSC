package com.ocena.qlsc.common.model;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public abstract class BaseMapperImpl<E, Q, R> implements BaseMapper<E, Q, R> {
    private final ModelMapper modelMapper;

    @Override
    public R entityToDto(E entity) {
        return modelMapper.map(entity, getResponseClass());
    }

    @Override
    public E dtoToEntity(Q dto) {
        return modelMapper.map(dto, getEntityClass());
    }

    @Override
    public void entityToDto(E entity, R dto) {
        modelMapper.map(entity, dto);
    }
    @Override
    public void dtoToEntity(Q dto, E entity) {
        modelMapper.map(dto, entity);
    }

    protected abstract Class<E> getEntityClass();

    protected abstract Class<Q> getRequestClass();

    protected abstract Class<R> getResponseClass();
}
