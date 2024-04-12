package com.tgmu.tgmu.domain.repository

import com.tgmu.tgmu.domain.model.Movie

interface MovieRepository {
    suspend fun getPopularMovies(): List<Movie>
    suspend fun searchMovies(query: String): List<Movie>
}