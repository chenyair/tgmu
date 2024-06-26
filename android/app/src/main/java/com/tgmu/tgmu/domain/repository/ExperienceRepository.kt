package com.tgmu.tgmu.domain.repository

import android.net.Uri
import com.tgmu.tgmu.domain.model.Comment
import com.tgmu.tgmu.domain.model.Experience
import com.tgmu.tgmu.utils.Resource
import kotlinx.coroutines.flow.Flow

interface ExperienceRepository {
    suspend fun getExperiences(): Flow<Resource<List<Experience>>>

    suspend fun getExperiencesByMovieId(id: Int): Flow<Resource<List<Experience>>>

    suspend fun addExperience(experience: Experience): Flow<Resource<Experience>>

    suspend fun toggleUserLike(experience: Experience, userId: String): Flow<Resource<List<String>>>

    suspend fun deleteExperience(experience: Experience): Flow<Resource<String>>

    suspend fun updateExperience(experience: Experience): Flow<Resource<Experience>>

    suspend fun addComment(experience: Experience, comment: Comment): Flow<Resource<Experience>>
}