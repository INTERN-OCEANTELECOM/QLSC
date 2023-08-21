package com.ocena.qlsc.common.model;

import com.ocena.qlsc.common.util.SystemUtils;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serial;
import java.io.Serializable;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@MappedSuperclass
public class BaseModel implements Cloneable, Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    @Id
    private String id;
    private Long created;
    private String creator;
    private Long updated;
    private String modifier;
    @Column(name = "removed", columnDefinition = "boolean default true")
    private Boolean removed;

    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }

    @PrePersist
    public void ensureId() {
        this.setId(UUID.randomUUID().toString());
        this.setCreated(System.currentTimeMillis());
        this.setCreator(SystemUtils.getCurrentEmail());
        this.setRemoved(false);
    }

    @PreUpdate
    private void setUpdated() {
        this.setModifier(SystemUtils.getCurrentEmail());
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

    public boolean equalsAll(Object obj) {
        return this.getId().equals(((BaseModel) obj).getId());
    }

    public String getKey(boolean isUpdated) {
        return this.id;
    }
}