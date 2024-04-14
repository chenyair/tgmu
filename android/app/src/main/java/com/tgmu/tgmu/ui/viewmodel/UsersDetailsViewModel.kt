package com.tgmu.tgmu.ui.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tgmu.tgmu.domain.model.Movie
import com.tgmu.tgmu.domain.model.UserDetails
import com.tgmu.tgmu.domain.repository.MovieRepository
import com.tgmu.tgmu.domain.repository.UserDetailsRepository
import com.tgmu.tgmu.utils.Resource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class UsersDetailsViewModel @Inject constructor(
    private val userDetailsRepository: UserDetailsRepository
) : ViewModel() {

    private val _currentUserDetails = MutableLiveData<Resource<UserDetails>>()

    val currentUserDetails: LiveData<Resource<UserDetails>>
        get() = _currentUserDetails

    fun getUserDetails(email: String) {
        viewModelScope.launch {
            userDetailsRepository.getUserDetails(email).collect {
                _currentUserDetails.value = it
            }
        }
    }
}