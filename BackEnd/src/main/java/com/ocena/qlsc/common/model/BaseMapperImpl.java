package com.ocena.qlsc.common.model;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public abstract class BaseMapperImpl<E, D> implements BaseMapper<E, D> {
    private final ModelMapper modelMapper;

    @Override
    public D entityToDto(E entity) {
        return modelMapper.map(entity, getDtoClass());
    }

    @Override
    public E dtoToEntity(D dto) {
        return modelMapper.map(dto, getEntityClass());
    }

    @Override
    public void entityToDto(E entity, D dto) {
        modelMapper.map(entity, dto);
    }
    @Override
    public void dtoToEntity(D dto, E entity) {
        modelMapper.map(dto, entity);
    }

    protected abstract Class<E> getEntityClass();

    protected abstract Class<D> getDtoClass();
}
