package com.ocena.qlsc.common.model;

import com.ocena.qlsc.common.util.SystemUtil;
import jakarta.persistence.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Data
@MappedSuperclass
public class BaseModel {
    @Id
    private String id;

    @Column
    private Long created;

    @Column
    private String creator;

    private Long updated;

    @Column
    private String modifier;

    @Column(name = "removed", columnDefinition = "boolean default true")
    private Boolean removed;

    @PrePersist
    private void ensureId() {
        this.setId(UUID.randomUUID().toString());
        this.setCreated(System.currentTimeMillis());
        this.setCreator(SystemUtil.getCurrentEmail());
        this.setRemoved(false);
    }

    @PreUpdate
    private void setUpdated() {
        this.setModifier(SystemUtil.getCurrentEmail());
        this.setUpdated(System.currentTimeMillis());
    }

    @Override
    public String toString() {
        return "BaseModel{" +
                "id='" + id + '\'' +
                ", created=" + created +
                ", creator='" + creator + '\'' +
                ", updated=" + updated +
                ", modifier='" + modifier + '\'' +
                ", removed=" + removed +
                '}';
    }
}
