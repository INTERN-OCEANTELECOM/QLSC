package com.ocena.qlsc.common.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.stereotype.Repository;

import java.util.List;

@NoRepositoryBean
public interface BaseRepository<E> extends JpaRepository<E, String> {
    List<E> findAllByIdIn(List<String> ids);
}
