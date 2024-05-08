package com.tgmu.tgmu.domain.repository

import android.net.Uri
import com.tgmu.tgmu.utils.Resource
import kotlinx.coroutines.flow.Flow

interface StorageRepository {
    suspend fun uploadImage(imageUri: Uri): Flow<Resource<String>>

    suspend fun deleteImage(imageUri: String): Flow<Resource<String>>
}