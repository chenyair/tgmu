package com.tgmu.tgmu.ui.viewmodel

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tgmu.tgmu.domain.model.UserDetails
import com.tgmu.tgmu.domain.repository.UserDetailsRepository
import com.tgmu.tgmu.utils.Resource
import kotlinx.coroutines.launch
import java.util.Date
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class UsersDetailsViewModel @Inject constructor(
    private val userDetailsRepository: UserDetailsRepository
) : ViewModel() {

    private var _currentUserDetails = MutableLiveData<Resource<UserDetails>>()

    val currentUserDetails: LiveData<Resource<UserDetails>>
        get() = _currentUserDetails

    fun getUserDetails(email: String) {
        viewModelScope.launch {
            userDetailsRepository.getUserDetails(email).collect {
                Log.d("UsersDetailsViewModel", "getUserDetails: $it")
                _currentUserDetails.value = it
            }
        }
    }

    fun showLoading() {
        _currentUserDetails.value = Resource.loading()
    }

    fun showFailed(message: String) {
        _currentUserDetails.value = Resource.failed(message)
    }

    fun createAndUpdateUserDetails(
        email: String,
        fullName: String,
        birthdate: Date,
        authUid: String
    ) {
        viewModelScope.launch {
            userDetailsRepository.createUserDetails(
                UserDetails(
                    email, fullName, birthdate, authUid
                )
            )
                .collect {
                    Log.d("UsersDetailsViewModel", "createUserDetails: $it")
                    _currentUserDetails.value = it
                }
        }
    }

    fun logOut() {
        // Reset value to default
        _currentUserDetails = MutableLiveData<Resource<UserDetails>>()
    }
}