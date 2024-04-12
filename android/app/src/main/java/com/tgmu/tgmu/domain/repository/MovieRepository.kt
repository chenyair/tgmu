package com.tgmu.tgmu.domain.repository

import com.tgmu.tgmu.domain.model.Movie

interface MovieRepository {
    suspend fun getPopularMovies(): List<Movie>
}