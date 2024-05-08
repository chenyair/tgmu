package com.tgmu.tgmu.data.repository

import android.net.Uri
import android.util.Log
import com.google.firebase.firestore.CollectionReference
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase
import com.google.firebase.storage.FirebaseStorage
import com.tgmu.tgmu.data.mapper.toFirestoreObject
import com.tgmu.tgmu.data.mapper.toModel
import com.tgmu.tgmu.data.remote.FirestoreExperience
import com.tgmu.tgmu.domain.model.Comment
import com.tgmu.tgmu.domain.model.Experience
import com.tgmu.tgmu.domain.repository.ExperienceRepository
import com.tgmu.tgmu.utils.Resource
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.tasks.await
import java.util.UUID
import javax.inject.Inject
import kotlin.math.exp

class ExperienceRepositoryImpl : ExperienceRepository {
    private val collection: CollectionReference = Firebase.firestore.collection("experiences")

    override suspend fun getExperiences(): Flow<Resource<List<Experience>>> = flow {
        emit(Resource.loading())
        val response = collection.get().await()
        val experiences =
            response.documents.map { it.toObject(FirestoreExperience::class.java)!!.toModel() }
        emit(Resource.success(experiences))
    }.catch {
        Log.e("ExperienceRepository", "getExperiences: $it")
        emit(Resource.failed("An error occurred while getting experiences"))
    }

    override suspend fun getExperiencesByMovieId(id: Int): Flow<Resource<List<Experience>>> = flow {
        emit(Resource.loading())
        val response = collection.whereEqualTo("movie_id", id).get().await()
        val experiences =
            response.documents.map { it.toObject(FirestoreExperience::class.java)!!.toModel() }
        emit(Resource.success(experiences))
    }.catch {
        Log.e("ExperienceRepository", "getExperiencesByMovieId: $it")
        emit(Resource.failed("An error occurred while getting experiences"))
    }

    override suspend fun addExperience(experience: Experience): Flow<Resource<Experience>> = flow {
        emit(Resource.loading())
        val documentReference = collection.add(experience.toFirestoreObject()).await()
        emit(Resource.success(experience.copy(id = documentReference.id)))
    }.catch {
        Log.e("ExperienceRepository", "addExperience: $it")
        emit(Resource.failed("An error occurred while adding experience"))
    }

    override suspend fun toggleUserLike(
        experience: Experience,
        userId: String
    ): Flow<Resource<List<String>>> = flow {
        emit(Resource.loading())
        val likedUsers = experience.likedUsers.toMutableList()
        if (likedUsers.contains(userId)) {
            likedUsers.remove(userId)
        } else {
            likedUsers.add(userId)
        }
        collection.document(experience.id!!).update("liked_users", likedUsers).await()
        emit(Resource.success(likedUsers.toList()))
    }.catch { e ->
        Log.e("ExperienceRepository", "toggleUserLike: $e")
        emit(Resource.failed("An error occurred while toggling like"))
    }

    override suspend fun deleteExperience(experience: Experience): Flow<Resource<String>> = flow {
        emit(Resource.loading())
        collection.document(experience.id!!).delete().await()
        emit(Resource.success(experience.id))
    }.catch {
        Log.e("ExperienceRepository", "deleteExperience: $it")
        emit(Resource.failed("An error occurred while deleting experience"))
    }

    override suspend fun updateExperience(experience: Experience): Flow<Resource<Experience>> =
        flow {
            emit(Resource.loading())
            Log.d("ExperienceRepository", "updateExperience: $experience")
            collection.document(experience.id!!).set(experience.toFirestoreObject()).await()
            emit(Resource.success(experience))
        }.catch {
            Log.e("ExperienceRepository", "updateExperience: $it")
            emit(Resource.failed("An error occurred while updating experience"))
        }

    override suspend fun addComment(
        experience: Experience,
        comment: Comment
    ): Flow<Resource<Experience>> =
        flow {
            emit(Resource.loading())
            val firestoreComment = comment.toFirestoreObject()
            collection.document(experience.id!!)
                .update("comments", FieldValue.arrayUnion(firestoreComment)).await()
            val updatedExperience = experience.copy(comments = experience.comments + comment)
            emit(Resource.success(updatedExperience))
        }.catch {
            Log.e("ExperienceRepository", "addComment: $it")
            emit(Resource.failed("An error occurred while adding comment"))
        }
}
