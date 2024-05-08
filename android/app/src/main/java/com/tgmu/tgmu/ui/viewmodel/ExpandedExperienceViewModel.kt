package com.tgmu.tgmu.ui.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tgmu.tgmu.domain.model.Comment
import com.tgmu.tgmu.domain.model.Experience
import com.tgmu.tgmu.domain.model.PopulatedComment
import com.tgmu.tgmu.domain.model.UserDetails
import com.tgmu.tgmu.domain.repository.ExperienceRepository
import com.tgmu.tgmu.domain.repository.UserDetailsRepository
import com.tgmu.tgmu.utils.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ExpandedExperienceViewModel @Inject constructor(
    private val userDetailsRepository: UserDetailsRepository,
    private val experienceRepository: ExperienceRepository
) : ViewModel() {
    private var _currExperiencePopulatedComments: MutableLiveData<Resource<List<PopulatedComment>>> =
        MutableLiveData()
    private var _currExperienceUserDetails: MutableLiveData<Resource<UserDetails>> =
        MutableLiveData()
    val currExperiencePopulatedComments: LiveData<Resource<List<PopulatedComment>>> get() = _currExperiencePopulatedComments
    val currExperienceUserDetails: LiveData<Resource<UserDetails>> get() = _currExperienceUserDetails

    fun populateComments(comments: List<Comment>) = viewModelScope.launch {
        val populatedComments = comments.map { comment ->
            val user = userDetailsRepository.getUserDetailsByAuthUid(comment.userId).first {
                it is Resource.Success
            } as Resource.Success

            PopulatedComment(
                comment.userId,
                comment.text,
                comment.createdAt,
                user.data.fullName
            )
        }
        _currExperiencePopulatedComments.postValue(Resource.success(populatedComments))
    }

    fun fetchUserDetails(authUid: String) = viewModelScope.launch {
        _currExperienceUserDetails.postValue(
            userDetailsRepository.getUserDetailsByAuthUid(authUid).first { it is Resource.Success })
    }
}