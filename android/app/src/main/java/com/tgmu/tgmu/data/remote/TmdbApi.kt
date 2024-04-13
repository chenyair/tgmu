package com.tgmu.tgmu.data.remote

import retrofit2.http.GET

interface TmdbApi {
    @GET("movie/popular")
    suspend fun getPopularMovies(): TmdbMovieList
}