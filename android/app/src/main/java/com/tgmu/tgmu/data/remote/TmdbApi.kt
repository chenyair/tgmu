package com.tgmu.tgmu.data.remote

import retrofit2.http.GET
import retrofit2.http.Query

interface TmdbApi {
    @GET("movie/popular")
    suspend fun getPopularMovies(): TmdbMovieList

    @GET("search/movie")
    suspend fun searchMovies(
        @Query("query") query: String,
        @Query("language") language: String = "en-US",
        @Query("page") page: Int = 1,
        @Query("include_adult") includeAdult: Boolean = false
    ): TmdbMovieList
}