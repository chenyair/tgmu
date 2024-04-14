package com.tgmu.tgmu.ui.viewmodel

import android.util.Log
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
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
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

    fun logOut() {
        // Reset value to default
        _currentUserDetails = MutableLiveData<Resource<UserDetails>>()

    }
}