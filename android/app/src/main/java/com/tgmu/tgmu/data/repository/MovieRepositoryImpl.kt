package com.tgmu.tgmu.data.repository

import android.util.Log
import com.tgmu.tgmu.data.local.MovieDao
import com.tgmu.tgmu.data.mapper.toEntity
import com.tgmu.tgmu.data.mapper.toModel
import com.tgmu.tgmu.data.remote.TmdbApi
import com.tgmu.tgmu.domain.model.Movie
import com.tgmu.tgmu.domain.repository.MovieRepository
import com.tgmu.tgmu.utils.Resource
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow

class MovieRepositoryImpl(private val tmdbApi: TmdbApi, private val movieDao: MovieDao) :
    MovieRepository {
    override suspend fun getPopularMovies(): Flow<Resource<List<Movie>>> = flow {
        emit(Resource.loading())
        try {
            val movies = tmdbApi.getPopularMovies().toModel()
            emit(Resource.success(crossReferenceWithLocalData(movies)))
        } catch (e: Exception) {
            Log.e("MovieRepositoryImpl", "getPopularMovies: $e")
            emit(Resource.failed("An error occurred while trying to fetch popular movies"))
        }
    }

    override suspend fun searchMovies(query: String): Flow<Resource<List<Movie>>> = flow {
        emit(Resource.loading())
        try {
            val movies = tmdbApi.searchMovies(query).toModel()
            emit(Resource.success(crossReferenceWithLocalData(movies)))
        } catch (e: Exception) {
            Log.e("MovieRepositoryImpl", "searchMovies: $e")
            emit(Resource.failed("An error occurred while trying to search movie"))
        }
    }

    override suspend fun toggleFavorite(movie: Movie): Flow<Resource<Boolean>> = flow {
        emit(Resource.loading())
        try {
            movieDao.upsertMovie(movie.copy(is_favorite = !movie.is_favorite).toEntity())
            emit(Resource.success(!movie.is_favorite))
        } catch (e: Exception) {
            Log.e("MovieRepositoryImpl", "markAsFavorite: $e")
            emit(Resource.failed("An error occurred while trying to mark movie as favorite"))
        }
    }

    private suspend fun crossReferenceWithLocalData(apiMovies: List<Movie>): List<Movie> {
        val favorites = movieDao.getFavorites()

        return apiMovies.map { apiMovie ->
            if (favorites.any { it.id == apiMovie.id }) {
                apiMovie.copy(is_favorite = true)
            } else {
                apiMovie
            }
        }
    }
}