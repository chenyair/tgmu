package com.tgmu.tgmu.ui.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tgmu.tgmu.domain.model.Movie
import com.tgmu.tgmu.domain.repository.MovieRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class MoviesViewModel @Inject constructor(
    private val movieRepository: MovieRepository
) : ViewModel() {

    private val _popularMovies = MutableLiveData<List<Movie>>()

    private val _posterMovies = MutableLiveData<List<Movie>>()
    val posterMovies: LiveData<List<Movie>> get() = _posterMovies

    private val _searchedMovies = MutableLiveData<List<Movie>>()
    val searchedMovies: LiveData<List<Movie>> get() = _searchedMovies

    init {
        getPopularMovies()
    }

    private fun getPopularMovies() {
        viewModelScope.launch {
            val result = movieRepository.getPopularMovies()
            _popularMovies.postValue(result)
            _posterMovies.postValue(result)
        }
    }

    fun searchMovies(query: String) {
        if (query.isEmpty()) {
            _searchedMovies.postValue(emptyList())
            return
        }

        viewModelScope.launch {
            val result = movieRepository.searchMovies(query)
            _searchedMovies.postValue(result)
        }
    }

    fun updatePosters(query: String) {
        if (query.isEmpty()) {
            _posterMovies.postValue(_popularMovies.value)
        } else {
            _posterMovies.postValue(_searchedMovies.value)
        }
    }
}