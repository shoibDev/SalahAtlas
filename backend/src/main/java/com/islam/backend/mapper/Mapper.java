package com.islam.backend.mapper;

public interface Mapper<A, B> {
    B mapTo(A a);

    A mapFrom(B b);
}
