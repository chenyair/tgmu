package com.tgmu.tgmu.ui.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tgmu.tgmu.domain.model.Comment
import com.tgmu.tgmu.domain.model.PopulatedComment
import com.tgmu.tgmu.domain.repository.ExperienceRepository
import com.tgmu.tgmu.domain.repository.UserDetailsRepository
import com.tgmu.tgmu.utils.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class CommentsViewModel @Inject constructor(
    private val userDetailsRepository: UserDetailsRepository,
    private val experienceRepository: ExperienceRepository
) : ViewModel() {
    private var _currExperienceComments: MutableLiveData<Resource<List<PopulatedComment>>> =
        MutableLiveData()
    val currExperienceComments: LiveData<Resource<List<PopulatedComment>>> get() = _currExperienceComments

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
        _currExperienceComments.postValue(Resource.success(populatedComments))
    }
}