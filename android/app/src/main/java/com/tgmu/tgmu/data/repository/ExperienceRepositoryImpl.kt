package com.tgmu.tgmu.data.repository

import android.util.Log
import com.google.firebase.firestore.CollectionReference
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase
import com.tgmu.tgmu.data.mapper.toModel
import com.tgmu.tgmu.data.remote.FirestoreExperience
import com.tgmu.tgmu.domain.model.Experience
import com.tgmu.tgmu.domain.repository.ExperienceRepository
import com.tgmu.tgmu.utils.Resource
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.tasks.await
import javax.inject.Inject

class ExperienceRepositoryImpl : ExperienceRepository {
    private lateinit var collection: CollectionReference

    init {
        collection = Firebase.firestore.collection("experiences")
    }

    override suspend fun getExperiences(): Flow<Resource<List<Experience>>> = flow {
        emit(Resource.loading())
        try {
            val response = collection.get().await()

            val experiences = response.documents.mapNotNull { it.toObject(FirestoreExperience::class.java)?.toModel() }
            emit(Resource.success(experiences))
        } catch (e: Exception) {
            Log.e("ExperienceRepository", "getExperiences: $e")
            emit(Resource.failed("An error occurred while getting experiences"))
        }
    }

    override suspend fun getExperiencesByMovieId(id: Int): Flow<Resource<List<Experience>>> = flow {
        emit(Resource.loading())
        try {
            val response = collection.whereEqualTo("movie_id", id).get().await()
            val experiences = response.documents.mapNotNull { it.toObject(FirestoreExperience::class.java)?.toModel() }
            emit(Resource.success(experiences))
        } catch (e: Exception) {
            Log.e("ExperienceRepository", "getExperiencesByMovieId: $e")
            emit(Resource.failed("An error occurred while getting experiences"))
        }
    }

    override suspend fun addExperience(experience: Experience): Flow<Resource<String>> = flow {
        emit(Resource.loading())
        try {
            val experienceMap = experience.toMap()
            val documentReference = collection.add(experienceMap).await()
            emit(Resource.success(documentReference.id))
        } catch (e: Exception) {
            Log.e("ExperienceRepository", "addExperience: $e")
            emit(Resource.failed("An error occurred while adding experience"))
        }
    }

    override suspend fun deleteExperience(experience: Experience): Flow<Resource<String>> = flow {
        emit(Resource.loading())
        try {
            collection.document(experience.id).delete().await()
            emit(Resource.success(experience.id))
        } catch (e: Exception) {
            Log.e("ExperienceRepository", "deleteExperience: $e")
            emit(Resource.failed("An error occurred while deleting experience"))
        }
    }

    override suspend fun updateExperience(experience: Experience): Flow<Resource<Experience>> =
        flow {
            emit(Resource.loading())
            try {
                val experienceMap = experience.toMap()
                collection.document(experience.id).set(experienceMap).await()
                emit(Resource.success(experience))
            } catch (e: Exception) {
                Log.e("ExperienceRepository", "updateExperience: $e")
                emit(Resource.failed("An error occurred while updating experience"))
            }
        }
}