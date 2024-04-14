package com.tgmu.tgmu.data.repository

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.google.firebase.firestore.CollectionReference
import com.google.firebase.firestore.firestore
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase
import com.tgmu.tgmu.domain.model.UserDetails
import com.tgmu.tgmu.domain.repository.UserDetailsRepository
import com.tgmu.tgmu.utils.Resource
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.tasks.await

class UserDetailsRepositoryImpl : UserDetailsRepository {
    private lateinit var collection: CollectionReference

    init {
        collection = Firebase.firestore.collection("users")
    }

    override suspend fun getUserDetails(email: String): LiveData<Resource<UserDetails>> {
        val liveData = MutableLiveData<Resource<UserDetails>>()
        liveData.value = Resource.loading()
        collection.whereEqualTo("email", email).get()
            .addOnSuccessListener { querySnapshot ->
                if (querySnapshot.isEmpty) {
                    liveData.value = Resource.failed("User not found")
                } else {
                    val userDetails =
                        querySnapshot.documents.first().toObject(UserDetails::class.java)
                    liveData.value = Resource.success(userDetails!!)
                }
            }.addOnFailureListener { exception ->
                Log.e("UserDetailsRepository", "Error getting user details", exception)
                liveData.value = Resource.failed("Error getting user details")
            }

        return liveData
    }
}