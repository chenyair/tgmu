package com.tgmu.tgmu.di

import com.tgmu.tgmu.data.repository.ExperienceRepositoryImpl
import com.tgmu.tgmu.data.repository.StorageRepositoryImpl
import com.tgmu.tgmu.domain.repository.ExperienceRepository
import com.tgmu.tgmu.domain.repository.StorageRepository
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
    fun provideExperienceRepository(): ExperienceRepository {
        return ExperienceRepositoryImpl()
    }

    @Provides
    @Singleton
    fun provideStorageRepository(): StorageRepository {
        return StorageRepositoryImpl()
    }
}