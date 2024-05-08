package com.tgmu.tgmu.ui.viewmodel

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tgmu.tgmu.domain.model.UpdateUserDetailsForm
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
    private var _userDetailsUpdate = MutableLiveData<Resource<UserDetails>>()
    private var _updateUserDetailsForm = MutableLiveData<UpdateUserDetailsForm>()

    val currentUserDetails: LiveData<Resource<UserDetails>>
        get() = _currentUserDetails
    val userDetailsUpdate: LiveData<Resource<UserDetails>>
        get() = _userDetailsUpdate
    val updateUserDetailsForm: LiveData<UpdateUserDetailsForm> get() = _updateUserDetailsForm

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

    fun updateUserDetails() {
        if (_updateUserDetailsForm.value == null || !isUpdateUserDetailsFormValid()) return

        val userDetailsBeforeUpdate = (currentUserDetails.value as Resource.Success).data
        viewModelScope.launch {
            val updatedUserDetails = _updateUserDetailsForm.value!!.toUserDetails(
                email = userDetailsBeforeUpdate.email,
                authUid = userDetailsBeforeUpdate.authUid
            )

            userDetailsRepository.updateUserDetails(updatedUserDetails).collect {
                Log.d("UsersDetailsViewModel", "updateUserDetails: $it")
                if (it is Resource.Success) {
                    _currentUserDetails.value = it
                }

                _userDetailsUpdate.value = it
            }
        }
    }

    fun changeUpdateUserDetailsFormData(
        fullName: String? = null,
        birthdate: Date? = null,
    ) {
        _updateUserDetailsForm.value = _updateUserDetailsForm.value!!.copy(
            fullName = fullName ?: _updateUserDetailsForm.value!!.fullName,
            birthdate = birthdate ?: _updateUserDetailsForm.value!!.birthdate,
        )
    }

    fun startUpdateUserDetailsForm(userDetails: UserDetails) {
        _updateUserDetailsForm.value =
            UpdateUserDetailsForm(userDetails.fullName, userDetails.birthdate)
    }

    fun isUpdateUserDetailsFormValid(): Boolean {
        return _updateUserDetailsForm.value!!.fullName.isNotBlank() && _updateUserDetailsForm.value!!.birthdate != null
    }

    fun logOut() {
        // Reset value to default
        _currentUserDetails = MutableLiveData<Resource<UserDetails>>()
    }
}