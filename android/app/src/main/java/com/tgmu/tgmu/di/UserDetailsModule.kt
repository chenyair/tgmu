package com.tgmu.tgmu.di

import com.tgmu.tgmu.data.repository.UserDetailsRepositoryImpl
import com.tgmu.tgmu.domain.repository.UserDetailsRepository
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object UserDetailsModule {

    @Provides
    @Singleton
    fun provideUserDetailsRepository(): UserDetailsRepository {
        return UserDetailsRepositoryImpl()
    }
}