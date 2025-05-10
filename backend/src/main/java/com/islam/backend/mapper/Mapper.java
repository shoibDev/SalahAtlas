package com.islam.backend.mapper;

public interface Mapper<E, D> {
    D mapTo(E e);

    default E mapFrom(D data) {
        throw new UnsupportedOperationException("mapFrom not supported");
    }
}
