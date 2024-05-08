package com.tgmu.tgmu.ui.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tgmu.tgmu.domain.model.Movie
import com.tgmu.tgmu.domain.repository.MovieRepository
import com.tgmu.tgmu.utils.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class MoviesViewModel @Inject constructor(
    private val movieRepository: MovieRepository
) : ViewModel() {

    private val _popularMovies = MutableLiveData<Resource<List<Movie>>>()

    private val _posterMovies = MutableLiveData<Resource<List<Movie>>>()
    val posterMovies: LiveData<Resource<List<Movie>>> get() = _posterMovies

    private val _searchedMovies = MutableLiveData<Resource<List<Movie>>>()
    val searchedMovies: LiveData<Resource<List<Movie>>> get() = _searchedMovies
    private val _selectedMovie = MutableLiveData<Movie>()
    val selectedMovie: LiveData<Movie> get() = _selectedMovie

    init {
        getPopularMovies()
    }

    private fun getPopularMovies() {
        viewModelScope.launch {
            delay(500L)
            movieRepository.getPopularMovies().collect {
                _popularMovies.postValue(it)
                _posterMovies.postValue(it)

            }
        }
    }


    fun searchMovies(query: String) {
        if (query.isEmpty()) {
            _searchedMovies.postValue(Resource.success(emptyList()))
            return
        }

        viewModelScope.launch {
            movieRepository.searchMovies(query).collect {
                _searchedMovies.postValue(it)
            }
        }
    }

    fun updatePosters(query: String) {
        if (query.isEmpty()) {
            _posterMovies.postValue(_popularMovies.value)
        } else {
            _posterMovies.postValue(_searchedMovies.value)
        }

    }

    fun selectMovie(movie: Movie) {
        _selectedMovie.postValue(movie)
    }

    fun toggleFavorite(movie: Movie) {
        viewModelScope.launch {
            movieRepository.toggleFavorite(movie).collect {
                if (it is Resource.Success) {
                    _selectedMovie.postValue(movie.copy(is_favorite = it.data))

                    val updatedList = (_posterMovies.value as Resource.Success).data.map { movie ->
                        if (movie.id == _selectedMovie.value?.id) {
                            movie.copy(is_favorite = it.data)
                        } else {
                            movie
                        }
                    }

                    _posterMovies.postValue(Resource.success(updatedList))
                }
            }
        }
    }
}