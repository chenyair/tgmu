package com.tgmu.tgmu.ui.viewmodel

import android.net.Uri
import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.google.firebase.Firebase
import com.google.firebase.auth.auth
import com.tgmu.tgmu.domain.model.Experience
import com.tgmu.tgmu.domain.model.Movie
import com.tgmu.tgmu.domain.repository.ExperienceRepository
import com.tgmu.tgmu.utils.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.util.Date
import javax.inject.Inject

@HiltViewModel
class ExperienceViewModel @Inject constructor(private val experienceRepository: ExperienceRepository) :
    ViewModel() {
    private val _latestExperiences = MutableLiveData<Resource<List<Experience>>>()
    val latestExperiences: LiveData<Resource<List<Experience>>> get() = _latestExperiences

    private val _uploadedExperience = MutableLiveData<Resource<Experience>>()
    private val _selectedMovie = MutableLiveData<Movie>()
    private val _title = MutableLiveData<String>()
    private val _description = MutableLiveData<String>()
    private val _selectedImageUri = MutableLiveData<Uri>()
    val uploadedExperience: LiveData<Resource<Experience>> get() = _uploadedExperience
    val selectedMovie: LiveData<Movie> get() = _selectedMovie
    val title: LiveData<String> get() = _title
    val description: LiveData<String> get() = _description
    val selectedImageUri: LiveData<Uri> get() = _selectedImageUri

    init {
        getLatestExperiences()
    }

    fun getLatestExperiences() =
        viewModelScope.launch {
            delay(500L)
            experienceRepository.getExperiences().collect {
                if (it is Resource.Success) {
                    val sortedExperiences = it.data.sortedByDescending { experience -> experience.createdAt }
                    _latestExperiences.postValue(Resource.Success(sortedExperiences))
                } else {
                    _latestExperiences.postValue(it)
                }
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

    fun setTitle(title: String) =
        _title.postValue(title)

    fun setDescription(description: String) =
        _description.postValue(description)

    fun selectImage(uri: Uri) =
        _selectedImageUri.postValue(uri)

    fun addExperience() =
        viewModelScope.launch {
            var imgUrl: String? = null
            _uploadedExperience.postValue(Resource.loading()) // Set loading
            experienceRepository.uploadImage(selectedImageUri.value!!).collect {
                if (it is Resource.Success) {
                    imgUrl = it.data
                } else if (it is Resource.Failed) {
                    _uploadedExperience.postValue(Resource.failed(it.message))
                }
            }

            val experience = Experience(
                id = null,
                title = title.value!!,
                moviePoster = selectedMovie.value!!.poster_path!!,
                movieName = selectedMovie.value!!.title,
                movieId = selectedMovie.value!!.id,
                userId = Firebase.auth.currentUser!!.uid,
                description = description.value!!,
                likedUsers = emptyList(),
                imgUrl = imgUrl!!,
                comments = emptyList(),
                createdAt = Date(),
            )

            experienceRepository.addExperience(experience).collect {
                if (it is Resource.Success) {
                    // Prepend the new experience to the list of experiences
                    val updatedExperiences =
                        listOf(it.data) + (latestExperiences.value as Resource.Success).data
                    _uploadedExperience.postValue(Resource.Success(it.data))
                    _latestExperiences.postValue(Resource.Success(updatedExperiences))
                } else if (it is Resource.Failed) {
                    _uploadedExperience.postValue(Resource.failed(it.message))
                }
            }
        }

    fun isReadyToUpload(): Boolean {
        return title.value != null && description.value != null && selectedMovie.value != null && selectedImageUri.value != null
    }

    fun toggleLiked(experience: Experience, userUID: String) =
        viewModelScope.launch {
            experienceRepository.toggleUserLike(experience, userUID).collect {
                if (it is Resource.Success) {
                    val updatedExperience = experience.copy(likedUsers = it.data)
                    val updatedExperiences =
                        (latestExperiences.value as Resource.Success).data.map { exp ->
                            if (exp.id == updatedExperience.id) updatedExperience else exp
                        }
                    _latestExperiences.postValue(Resource.Success(updatedExperiences))
                }
            }
        }
}