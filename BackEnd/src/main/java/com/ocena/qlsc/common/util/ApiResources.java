package com.ocena.qlsc.common.util;

public interface ApiResources {
    public static final String ADD = "/add";

    public static final String ADD_ALL = "/add-all";

    public static final String UPDATE = "/update/{key}";

    public static final String GET_BY_ID = "/get-by-id";

    public static final String DELETE = "/delete/{id}";

    public static final String GET_ALL = "/get-all";

    public static final String GET_BY_IDS = "/get-by-ids";

    public static final String GET_ALL_BY_KEYWORD = "/get-all-by-keyword";

    public static final String SEARCH_BY_KEYWORD= "/search-by-keyword";

    public static final String GET_ALL_BY_PAGE = "/get-all-by-page";
}
