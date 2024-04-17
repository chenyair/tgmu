package com.tgmu.tgmu.ui.viewmodel

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.map
import androidx.lifecycle.viewModelScope
import com.tgmu.tgmu.domain.model.Experience
import com.tgmu.tgmu.domain.model.Movie
import com.tgmu.tgmu.domain.repository.ExperienceRepository
import com.tgmu.tgmu.utils.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ExperienceViewModel @Inject constructor(private val experienceRepository: ExperienceRepository) :
    ViewModel() {
    private val _latestExperiences = MutableLiveData<Resource<List<Experience>>>()
    val latestExperiences: LiveData<Resource<List<Experience>>> get() = _latestExperiences

    private val _selectedMovie = MutableLiveData<Movie>()
    val selectedMovie: LiveData<Movie> get() = _selectedMovie

    init {
        getLatestExperiences()
    }

    fun getLatestExperiences() =
        viewModelScope.launch {
            delay(500L)
            experienceRepository.getExperiences().collect {
                Log.d("UsersDetailsViewModel", "getUserDetails: $it")
                _latestExperiences.postValue(it)
            }
        }

    fun getExperiencesByMovieId(movieId: Int) =
        viewModelScope.launch {
            experienceRepository.getExperiencesByMovieId(movieId).collect {
                _latestExperiences.postValue(it)
            }
        }

    fun selectMovie(movie: Movie) =
        _selectedMovie.postValue(movie)

    fun addExperience(experience: Experience) =
        viewModelScope.launch {
            experienceRepository.addExperience(experience).collect {
                if (it is Resource.Success) {
                    val updatedExperiences =
                        (latestExperiences.value as Resource.Success).data + experience
                    _latestExperiences.postValue(Resource.Success(updatedExperiences))
                }
            }
        }

    fun toggleLiked(experience: Experience, userUID: String) =
        viewModelScope.launch {
            experienceRepository.toggleUserLike(experience, userUID).collect {
                if (it is Resource.Success) {
                    val updatedExperience = experience.copy(likedUsers = it.data)
                    val updatedExperiences = (latestExperiences.value as Resource.Success).data.map { exp ->
                        if (exp.id == updatedExperience.id) updatedExperience else exp
                    }
                    _latestExperiences.postValue(Resource.Success(updatedExperiences))
                }
            }
        }
}