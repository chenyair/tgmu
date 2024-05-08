package com.tgmu.tgmu.data.repository

import android.net.Uri
import android.util.Log
import com.google.firebase.storage.FirebaseStorage
import com.tgmu.tgmu.domain.repository.StorageRepository
import com.tgmu.tgmu.utils.Resource
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.tasks.await
import java.util.UUID

class StorageRepositoryImpl : StorageRepository {
    private val firebaseStorage = FirebaseStorage.getInstance()
    override suspend fun uploadImage(imageUri: Uri): Flow<Resource<String>> = flow {
        emit(Resource.loading())
        val ref = firebaseStorage.reference.child("images/${UUID.randomUUID()}")

        try {
            val response = ref.putFile(imageUri).await()
            response.metadata?.reference?.downloadUrl?.await()?.toString()?.let {
                emit(Resource.success(it))
            } ?: throw Exception("Could not access metadata.reference.downloadUrl")
        } catch (e: Exception) {
            Log.e("ExperienceRepository", "uploadImage: $e")
            emit(Resource.failed("An error occurred while uploading image"))
        }
    }

    override suspend fun deleteImage(imageUri: String): Flow<Resource<String>> = flow {
        emit(Resource.loading())
        try {
            firebaseStorage.getReferenceFromUrl(imageUri).delete().await()
            emit(Resource.success(imageUri))
        } catch (e: Exception) {
            Log.e("ExperienceRepository", "deleteImage: $e")
            emit(Resource.failed("An error occurred while deleting image"))
        }
    }
}