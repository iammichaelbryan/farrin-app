package com.farrin.farrin.dto;

public abstract class DTOBuilder<T> {
    protected T product;
    
    public abstract DTOBuilder<T> reset();
    public abstract T getResult();
}