package com.tgmu.tgmu.ui.viewmodel

import android.net.Uri
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.google.firebase.Firebase
import com.google.firebase.auth.auth
import com.tgmu.tgmu.domain.model.Experience
import com.tgmu.tgmu.domain.model.ExperienceForm
import com.tgmu.tgmu.domain.model.Movie
import com.tgmu.tgmu.domain.repository.ExperienceRepository
import com.tgmu.tgmu.domain.repository.StorageRepository
import com.tgmu.tgmu.utils.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.launch
import java.util.Date
import javax.inject.Inject
import kotlin.math.exp

@HiltViewModel
class ExperienceViewModel @Inject constructor(
    private val experienceRepository: ExperienceRepository,
    private val storageRepository: StorageRepository
) :
    ViewModel() {
    private val _latestExperiences = MutableLiveData<Resource<List<Experience>>>()
    val latestExperiences: LiveData<Resource<List<Experience>>> get() = _latestExperiences

    private val _experienceForm = MutableLiveData<ExperienceForm>()
    val experienceForm: LiveData<ExperienceForm> get() = _experienceForm

    private val _uploadStatus = MutableLiveData<Resource<Any>>()
    val uploadStatus: LiveData<Resource<Any>> get() = _uploadStatus

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

    fun changeExperienceFormData(
        title: String? = null,
        description: String? = null,
        movieId: Int? = null,
        movieName: String? = null,
        moviePoster: String? = null,
        imgFileUri: Uri? = null,
        existingImgUrl: String? = null
    ) {
        val currValue = _experienceForm.value ?: ExperienceForm()
        _uploadStatus.postValue(Resource.Loading())
        _experienceForm.postValue(
            currValue.copy(
                title = title ?: currValue.title,
                description = description ?: currValue.description,
                movieId = movieId ?: currValue.movieId,
                movieName = movieName ?: currValue.movieName,
                moviePoster = moviePoster ?: currValue.moviePoster,
                imgFileUri = imgFileUri ?: currValue.imgFileUri,
                existingImgUrl = existingImgUrl ?: currValue.existingImgUrl
            )
        )
    }

    fun isReadyToUpload(): Boolean {
        experienceForm.value!!.apply {
            val hasImage = imgFileUri != null || existingImgUrl.isNotEmpty()
            return title != "" && description != "" && movieId != null && hasImage
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

    fun postExperience(initialExperience: Experience? = null) {
        if (!isReadyToUpload()) return _uploadStatus.postValue(Resource.failed("Please fill all fields"))
        viewModelScope.launch {

            _uploadStatus.postValue(Resource.loading())
            val formValues = experienceForm.value!!
            var imgUrl = initialExperience?.imgUrl
            if (formValues.imgFileUri != null) {
                // upload new image to storage
                try {
                    storageRepository.uploadImage(formValues.imgFileUri!!).collect {
                        if (it is Resource.Success) {
                            imgUrl = it.data
                        } else if (it is Resource.Failed) {
                            _uploadStatus.postValue(Resource.failed(it.message))
                            throw Exception("Failed to upload image")
                        }
                    }
                } catch (e: Exception) {
                    return@launch
                }

                // Check if need to delete old image from storage
                if (initialExperience?.imgUrl?.isNotEmpty() == true) { // Compare nullable
                    storageRepository.deleteImage(initialExperience.imgUrl).collect {
                        if (it is Resource.Failed) {
                            _uploadStatus.postValue(Resource.failed(it.message))
                        }
                    }
                }
            }

            val experienceToUpload = formValues.toExperience(
                userId = Firebase.auth.currentUser!!.uid,
                imgUrl = imgUrl!!,
                initialExperience = initialExperience
            )

            if (initialExperience == null) {
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