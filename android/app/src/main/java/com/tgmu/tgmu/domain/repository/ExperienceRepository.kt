package com.tgmu.tgmu.domain.repository

import com.tgmu.tgmu.domain.model.Experience

interface ExperienceRepository {
    suspend fun getExperiences(): List<Experience>

    suspend fun addExperience(experience: Experience): Experience

    suspend fun deleteExperience(experience: Experience): Experience

    suspend fun updateExperience(experience: Experience): Experience

    suspend fun getExperiencesByMovieId(id: Int): List<Experience>
}