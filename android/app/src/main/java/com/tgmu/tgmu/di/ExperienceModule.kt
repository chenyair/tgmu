package com.tgmu.tgmu.di

import com.tgmu.tgmu.data.repository.ExperienceRepositoryImpl
import com.tgmu.tgmu.domain.repository.ExperienceRepository
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
class ExperienceModule {

    @Provides
    @Singleton
    fun provideUserDetailsRepository(): ExperienceRepository {
        return ExperienceRepositoryImpl()
    }
}