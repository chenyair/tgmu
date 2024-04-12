package com.tgmu.tgmu.data.repository

import com.tgmu.tgmu.data.mapper.toModel
import com.tgmu.tgmu.data.remote.TmdbApi
import com.tgmu.tgmu.domain.model.Movie
import com.tgmu.tgmu.domain.repository.MovieRepository

class MovieRepositoryImpl(private val tmdbApi: TmdbApi) : MovieRepository {
    override suspend fun getPopularMovies(): List<Movie> {
        return tmdbApi.getPopularMovies().toModel()
    }

    override suspend fun searchMovies(query: String): List<Movie> {
        return tmdbApi.searchMovies(query).toModel()
    }
}