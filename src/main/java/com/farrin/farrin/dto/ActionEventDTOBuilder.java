package com.farrin.farrin.dto;

import com.farrin.farrin.model.EventContext;

import java.time.LocalDateTime;

public class ActionEventDTOBuilder extends DTOBuilder<ActionEventDTO> {
    
    public ActionEventDTOBuilder() {
        reset();
    }
    
    @Override
    public DTOBuilder<ActionEventDTO> reset() {
        this.product = new ActionEventDTO();
        return this;
    }
    
    public ActionEventDTOBuilder setId(Integer id) {
        this.product.setId(id);
        return this;
    }
    
    public ActionEventDTOBuilder setUserId(Integer userId) {
        this.product.setUserId(userId);
        return this;
    }
    
    public ActionEventDTOBuilder setEvent(EventContext event) {
        this.product.setEvent(event);
        return this;
    }
    
    public ActionEventDTOBuilder setTimestamp(LocalDateTime timestamp) {
        this.product.setTimestamp(timestamp);
        return this;
    }
    
    @Override
    public ActionEventDTO getResult() {
        ActionEventDTO result = this.product;
        reset();
        return result;
    }
}