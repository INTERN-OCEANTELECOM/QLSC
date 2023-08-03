package com.ocena.qlsc.common.model;

import com.ocena.qlsc.common.constants.FieldsConstants;
import com.ocena.qlsc.common.util.SystemUtil;
import com.ocena.qlsc.po.model.Po;
import com.ocena.qlsc.product.model.Product;
import com.ocena.qlsc.user.model.Role;
import com.ocena.qlsc.common.util.DateUtil;
import com.ocena.qlsc.common.util.ReflectionUtil;
import com.ocena.qlsc.user_history.enums.Action;
import com.ocena.qlsc.user_history.model.HistoryDescription;
import jakarta.persistence.*;
import lombok.*;


import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@MappedSuperclass
public class BaseModel implements Cloneable {

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

    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }

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

    public String getVietNameseFieldName(String fieldName) {
        return ((HashMap<String, String>)ReflectionUtil
                .getFieldValueByReflection(this.getClass().getSimpleName().toUpperCase() + "_FIELDS_MAP", new FieldsConstants()))
                .get(fieldName);
    }

    private void setHistoryEditRole(Object oldFieldValue,
                                    Object newFieldValue,
                                    List<String> diffProperties,
                                    List<String> previousObjectAttributeValues,
                                    List<String> newObjectAttributeValues) {
        List<Role> listOldRoles = (List<Role>) oldFieldValue;
        List<Role> listNewRoles = (List<Role>) newFieldValue;

        // Compare on Roles Fields
        if(listOldRoles == null && listNewRoles != null) {
            diffProperties.add("Quyền");
            previousObjectAttributeValues.add("null");
            newObjectAttributeValues.add(listNewRoles.get(0).getRoleName());
        }
        else if (!listOldRoles.get(0).getId().equals(listNewRoles.get(0).getId())) {
            diffProperties.add("Quyền");
            previousObjectAttributeValues.add(listOldRoles.get(0).getRoleName());
            newObjectAttributeValues.add(listNewRoles.get(0).getRoleName());
        }
    }

    public <T extends BaseModel> String compare(T newObject, Action action, HistoryDescription description) {
        List<String> diffProperties = new ArrayList<>();
        List<String> previousObjectAttributeValues = new ArrayList<>();
        List<String> newObjectAttributeValues = new ArrayList<>();
        Class<? extends BaseModel> clazz = this.getClass();
        try {
            for (Field field : clazz.getDeclaredFields()) {
                field.setAccessible(true);
                Object oldFieldValue = field.get(this);
                Object newFieldValue = field.get(newObject);
                if(oldFieldValue == null && newFieldValue == null)
                    continue;


                if(newFieldValue == null
                        && !field.getType().equals(Short.class)
                        && !field.getType().equals(Long.class)) {
                    continue;
                }

                if(newFieldValue instanceof Product || newFieldValue instanceof Po || field.getName().equals("status") || field.getName().equals("password"))
                    continue;


                if ((newFieldValue == null && oldFieldValue != null) || !newFieldValue.equals(oldFieldValue)) {
                    if (field.getName().equals("roles")) {
                        setHistoryEditRole(oldFieldValue, newFieldValue, diffProperties, previousObjectAttributeValues, newObjectAttributeValues);
                    } else {
                        diffProperties.add(getVietNameseFieldName(field.getName()));
                        previousObjectAttributeValues.add(DateUtil.convertObjectToDateFormat(oldFieldValue, field.getName()));
                        newObjectAttributeValues.add(DateUtil.convertObjectToDateFormat(newFieldValue, field.getName()));
                    }
                }
            }
        } catch (IllegalAccessException e){
            throw new RuntimeException(e);
        }

        if (diffProperties.size() > 0) {
            if (action == Action.EDIT) {
                return description.setDescription(diffProperties, previousObjectAttributeValues, newObjectAttributeValues);
            } else if (action == Action.CREATE) {
                return description.setDescription(diffProperties, newObjectAttributeValues);
            }
        }
        return "";
    }
}