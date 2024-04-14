package com.tgmu.tgmu.domain.repository

import androidx.lifecycle.LiveData
import com.tgmu.tgmu.domain.model.UserDetails
import com.tgmu.tgmu.utils.Resource
import kotlinx.coroutines.flow.Flow

interface UserDetailsRepository {

    suspend fun getUserDetails(email: String): Flow<Resource<UserDetails>>
}