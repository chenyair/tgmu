package com.tgmu.tgmu.domain.repository

import com.tgmu.tgmu.domain.model.Movie
import com.tgmu.tgmu.utils.Resource
import kotlinx.coroutines.flow.Flow

interface MovieRepository {
    suspend fun getPopularMovies(): Flow<Resource<List<Movie>>>
    suspend fun searchMovies(query: String): Flow<Resource<List<Movie>>>
}