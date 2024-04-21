package com.tgmu.tgmu.ui.viewmodel

import android.net.Uri
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
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import java.util.Date
import javax.inject.Inject

@HiltViewModel
class ExperienceViewModel @Inject constructor(private val experienceRepository: ExperienceRepository) :
    ViewModel() {
    private val _latestExperiences = MutableLiveData<Resource<List<Experience>>>()
    val latestExperiences: LiveData<Resource<List<Experience>>> get() = _latestExperiences

    private val _specificExperience = MutableLiveData<Resource<Experience>>()

    //    private val _selectedMovie = MutableLiveData<Movie>()
//    private val _title = MutableLiveData<String>()
//    private val _description = MutableLiveData<String>()
    val specificExperience: LiveData<Resource<Experience>> get() = _specificExperience

    private val _uploadStatus = MutableLiveData<Resource<Any>>()
    val uploadStatus: LiveData<Resource<Any>> get() = _uploadStatus

    //    val selectedMovie: LiveData<Movie> get() = _selectedMovie
//    val title: LiveData<String> get() = _title
//    val description: LiveData<String> get() = _description
    private val _fileUploadURI = MutableLiveData<Uri>()
    val fileUploadURI: LiveData<Uri> get() = _fileUploadURI

    init {
        getLatestExperiences()
    }

    fun getLatestExperiences() =
        viewModelScope.launch {
            delay(500L)
            experienceRepository.getExperiences().collect {
                if (it is Resource.Success) {
                    val sortedExperiences =
                        it.data.sortedByDescending { experience -> experience.createdAt }
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

    fun setDefaultExperience() =
        _specificExperience.postValue(
            Resource.Success(
                Experience(
                    id = null,
                    title = "",
                    moviePoster = "",
                    movieName = "",
                    movieId = 0,
                    userId = Firebase.auth.currentUser!!.uid,
                    description = "",
                    likedUsers = emptyList(),
                    imgUrl = "",
                    comments = emptyList(),
                    createdAt = Date(),
                )
            )
        )

    fun selectMovie(movie: Movie) {
        val currExperience = specificExperience.value as Resource.Success
        _specificExperience.postValue(
            Resource.Success(
                currExperience.data.copy(
                    movieId = movie.id,
                    moviePoster = movie.poster_path!!,
                    movieName = movie.title
                )
            )
        )
    }

    fun setTitle(title: String) =
        _specificExperience.postValue(
            Resource.Success(
                (specificExperience.value as Resource.Success).data.copy(title = title)
            )
        )


    fun setDescription(description: String) =
        _specificExperience.postValue(
            Resource.Success(
                (specificExperience.value as Resource.Success).data.copy(description = description)
            )
        )

    fun selectImageFile(uri: Uri) =
        _fileUploadURI.postValue(uri)

    fun setSpecificExperience(experience: Experience) {
        _specificExperience.postValue(Resource.Success(experience))
    }


    fun isReadyToUpload(): Boolean {
        (specificExperience.value as Resource.Success).data.apply {
            val hasImage = fileUploadURI.value != null || imgUrl != ""
            return title != "" && description != "" && movieId != 0 && hasImage
        }
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

    fun postExperience() {
        if (!isReadyToUpload()) return _uploadStatus.postValue(Resource.failed("Please fill all fields"))
        viewModelScope.launch {

            _uploadStatus.postValue(Resource.loading())
            val initialExperience = (specificExperience.value as Resource.Success).data
            var imgUrl = initialExperience.imgUrl
            if (fileUploadURI.value != null) {
                // upload new image to storage
                experienceRepository.uploadImage(fileUploadURI.value!!).collect {
                    if (it is Resource.Success) {
                        imgUrl = it.data
                    } else if (it is Resource.Failed) {
                        _specificExperience.postValue(Resource.failed(it.message))
                    }
                }

                // Check if need to delete old image from storage
                if (initialExperience.imgUrl != "") {
                    experienceRepository.deleteImage(initialExperience.imgUrl).collect {
                        if (it is Resource.Failed) {
                            _uploadStatus.postValue(Resource.failed(it.message))
                        }
                    }
                }
            }

            val experienceToUpload = initialExperience.copy(
                imgUrl = imgUrl,
                createdAt = Date()
            )

            if (initialExperience.id == null) {
                processPostExperience(
                    experienceToUpload,
                    experienceRepository::addExperience
                ) { list, experience -> listOf(experience) + list }
            } else {
                processPostExperience(
                    experienceToUpload,
                    experienceRepository::updateExperience
                ) { list, experience ->
                    list.map { exp -> if (exp.id == experience.id) experience else exp }
                }
            }
        }
    }

    private suspend fun processPostExperience(
        experienceToUpload: Experience,
        uploadFunc: suspend (Experience) -> Flow<Resource<Experience>>,
        makeNewListFunc: (List<Experience>, Experience) -> List<Experience>
    ) = uploadFunc.invoke(experienceToUpload).collect {
        if (it is Resource.Success) {
            val updatedExperiences =
                makeNewListFunc((latestExperiences.value as Resource.Success).data, it.data)
            _latestExperiences.postValue(Resource.Success(updatedExperiences))
            _uploadStatus.postValue(Resource.Success(Any()))
        } else if (it is Resource.Failed) {
            _uploadStatus.postValue(
                Resource.Failed(
                    it.message ?: "An error occurred while uploading experience"
                )
            )
        }
    }
}