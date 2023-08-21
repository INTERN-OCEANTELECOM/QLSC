package com.ocena.qlsc.common.model;

public interface BaseMapper<E, Q, R>{
    R entityToDto(E entity);

    E dtoToEntity(Q dto);

    void entityToDto(E entity, R dto);

    void dtoToEntity(Q dto, E entity);
}
