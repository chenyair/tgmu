package com.tgmu.tgmu.ui.viewmodel

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tgmu.tgmu.domain.model.Experience
import com.tgmu.tgmu.domain.repository.ExperienceRepository
import com.tgmu.tgmu.utils.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ExperienceViewModel @Inject constructor(private val experienceRepository: ExperienceRepository) :
    ViewModel() {
    private val _latestExperiences = MutableLiveData<Resource<List<Experience>>>()

    val latestExperiences: LiveData<Resource<List<Experience>>> get() = _latestExperiences

    init {
        getLatestExperiences()
    }

    fun getLatestExperiences() {
        viewModelScope.launch {
            experienceRepository.getExperiences().collect {
                Log.d("UsersDetailsViewModel", "getUserDetails: $it")
                _latestExperiences.postValue(it)
            }
        }
    }

    fun getExperiencesByMovieId(movieId: Int) {
        viewModelScope.launch {
            experienceRepository.getExperiencesByMovieId(movieId).collect {
                _latestExperiences.postValue(it)
            }
        }
    }

    fun toggleLiked(experience: Experience, userUID: String) {
        viewModelScope.launch {
            val updatedLikedUsers = if (userUID in experience.likedUsers) {
                experience.likedUsers - userUID
            } else {
                experience.likedUsers + userUID
            }
            val updatedExperience = experience.copy(likedUsers = updatedLikedUsers)
            Log.d("ExperienceViewModel", "toggleLiked: $updatedExperience")
            experienceRepository.updateExperience(updatedExperience).collect { result ->
                if (result is Resource.Success) {
                    val updatedExperiences = (latestExperiences.value as Resource.Success).data
                        .map { if (it.id == result.data.id) result.data else it }
                    _latestExperiences.postValue(Resource.Success(updatedExperiences))
                }
            }
        }
    }
}