package com.tgmu.tgmu.data.repository

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.google.firebase.firestore.CollectionReference
import com.google.firebase.firestore.firestore
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase
import com.tgmu.tgmu.data.mapper.toModel
import com.tgmu.tgmu.data.remote.FirestoreUserDetails
import com.tgmu.tgmu.domain.model.UserDetails
import com.tgmu.tgmu.domain.repository.UserDetailsRepository
import com.tgmu.tgmu.utils.Resource
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.tasks.await
import com.tgmu.tgmu.data.mapper.toFirestoreObject
import kotlinx.coroutines.flow.catch

class UserDetailsRepositoryImpl : UserDetailsRepository {
    private lateinit var collection: CollectionReference

    init {
        collection = Firebase.firestore.collection("users_details")
    }

    override suspend fun getUserDetails(email: String): Flow<Resource<UserDetails>> = flow {
        emit(Resource.loading())
        try {
            val result = collection.whereEqualTo("email", email).get().await()
            if (result.isEmpty) {
                emit(Resource.failed("User not found"))
            } else {
                Log.d("UserDetailsRepository", "getUserDetails: ${result.documents.first()}")
                val userDetails =
                    result.documents.first().toObject(FirestoreUserDetails::class.java)
                emit(Resource.success(userDetails!!.toModel()))
            }
        } catch (e: Exception) {
            Log.e("UserDetailsRepository", "getUserDetails: $e")
            emit(Resource.failed("An error communicating with firebase occurred"))
        }
    }

    override suspend fun getUserDetailsByAuthUid(authUid: String): Flow<Resource<UserDetails>> =
        flow {
            emit(Resource.loading())
            val result = collection.whereEqualTo("auth_uid", authUid).get().await()
            if (result.isEmpty) {
                emit(Resource.failed("User not found"))
            } else {
                Log.d("UserDetailsRepository", "getUserDetails: ${result.documents.first()}")
                val userDetails =
                    result.documents.first().toObject(FirestoreUserDetails::class.java)
                emit(Resource.success(userDetails!!.toModel()))
            }
        }.catch {
            Log.e("UserDetailsRepository", "getUserDetails: $it")
            emit(Resource.failed("An error communicating with firebase occurred"))
        }

    override suspend fun createUserDetails(userDetails: UserDetails): Flow<Resource<UserDetails>> =
        flow {
            emit(Resource.loading())
            try {
                val newDocRef = collection.add(userDetails.toFirestoreObject()).await()
                Log.d("UserDetailsRepository", "createUserDetails: $newDocRef")
                val createdUserDetails =
                    newDocRef.get().await().toObject(FirestoreUserDetails::class.java)
                emit(Resource.success(createdUserDetails!!.toModel()))
            } catch (e: Exception) {
                Log.e("UserDetailsRepository", "createUserDetails: $e")
                emit(Resource.failed("An error communicating with firebase occurred"))
            }
        }

    override suspend fun updateUserDetails(userDetails: UserDetails): Flow<Resource<UserDetails>> =
        flow {
            emit(Resource.loading())
            try {
                val result = collection.whereEqualTo("email", userDetails.email).get().await()
                if (result.isEmpty) {
                    emit(Resource.failed("User not found"))
                } else {
                    val docId = result.documents.first().id
                    collection.document(docId).set(userDetails.toFirestoreObject()).await()
                    emit(Resource.success(userDetails))
                }
            } catch (e: Exception) {
                Log.e("UserDetailsRepository", "updateUserDetails: $e")
                emit(Resource.failed("An error communicating with firebase occurred"))
            }

        }
}