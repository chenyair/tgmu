package com.tgmu.tgmu.data.repository

import android.util.Log
import com.tgmu.tgmu.data.mapper.toModel
import com.tgmu.tgmu.data.remote.TmdbApi
import com.tgmu.tgmu.domain.model.Movie
import com.tgmu.tgmu.domain.repository.MovieRepository
import com.tgmu.tgmu.utils.Resource
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow

class MovieRepositoryImpl(private val tmdbApi: TmdbApi) : MovieRepository {
    override suspend fun getPopularMovies(): Flow<Resource<List<Movie>>> = flow {
        emit(Resource.loading())
        try {
            val movies = tmdbApi.getPopularMovies().toModel()
            emit(Resource.success(movies))
        } catch (e: Exception) {
            Log.e("MovieRepositoryImpl", "getPopularMovies: $e")
            emit(Resource.failed("An error occurred while trying to fetch popular movies"))
        }
    }

    override suspend fun searchMovies(query: String): Flow<Resource<List<Movie>>> = flow {
        emit(Resource.loading())
        try {
            val movies = tmdbApi.searchMovies(query).toModel()
            emit(Resource.success(movies))
        } catch (e: Exception) {
            Log.e("MovieRepositoryImpl", "searchMovies: $e")
            emit(Resource.failed("An error occurred while trying to search movie"))
        }
    }
}