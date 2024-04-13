package com.tgmu.tgmu.data.remote

data class TmdbMovieList(
    val page: Int,
    val results: List<TmdbMovie>,
    val total_pages: Int,
    val total_results: Int
)