package com.farrin.farrin.dto;

public class BucketListDTOBuilder extends DTOBuilder<BucketListDTO> {
    
    public BucketListDTOBuilder() {
        reset();
    }
    
    @Override
    public DTOBuilder<BucketListDTO> reset() {
        this.product = new BucketListDTO();
        return this;
    }
    
    public BucketListDTOBuilder setUserId(Integer userId) {
        this.product.setUserId(userId);
        return this;
    }
    
    public BucketListDTOBuilder setDestinationId(Integer destinationId) {
        this.product.setDestinationId(destinationId);
        return this;
    }
    
    @Override
    public BucketListDTO getResult() {
        BucketListDTO result = this.product;
        reset();
        return result;
    }
}