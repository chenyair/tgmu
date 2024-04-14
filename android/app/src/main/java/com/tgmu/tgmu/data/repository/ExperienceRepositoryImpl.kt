package com.tgmu.tgmu.data.repository

import com.google.firebase.firestore.FirebaseFirestore
import com.tgmu.tgmu.domain.model.Experience
import com.tgmu.tgmu.domain.repository.ExperienceRepository
import kotlinx.coroutines.tasks.await
import javax.inject.Inject

class ExperienceRepositoryImpl @Inject constructor(
    private val db: FirebaseFirestore
) : ExperienceRepository {
    private val collection = db.collection("experiences")
    override suspend fun getExperiences(): List<Experience> {
        val snapshot = collection.get().await()
        return snapshot.documents.mapNotNull { it.toObject(Experience::class.java) }
    }

    override suspend fun addExperience(experience: Experience): Experience {
        val experienceMap = experience.toMap()
        val documentReference = collection.add(experienceMap).await()
        return documentReference.get().await().toObject(Experience::class.java)!!
    }

    override suspend fun deleteExperience(experience: Experience): Experience {
        collection.document(experience.id).delete().await()
        return experience
    }

    override suspend fun updateExperience(experience: Experience): Experience {
        val experienceMap = experience.toMap()
        collection.document(experience.id).set(experienceMap).await()
        return experience
    }

    override suspend fun getExperiencesByMovieId(id: Int): List<Experience> {
        val snapshot = collection.whereEqualTo("movie_id", id).get().await()
        return snapshot.documents.mapNotNull { it.toObject(Experience::class.java) }
    }
}