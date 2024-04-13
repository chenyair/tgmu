package com.tgmu.tgmu.di

import com.tgmu.tgmu.BuildConfig
import com.tgmu.tgmu.data.remote.BearerAuthInterceptor
import com.tgmu.tgmu.data.remote.TmdbApi
import com.tgmu.tgmu.data.repository.MovieRepositoryImpl
import com.tgmu.tgmu.domain.repository.MovieRepository
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object MovieModule {
    @Provides
    @Singleton
    fun provideTmdbApi(): TmdbApi {
        val client = OkHttpClient.Builder()
            .addInterceptor(BearerAuthInterceptor(BuildConfig.TMDB_API_KEY))
            .build()

        return Retrofit.Builder()
            .baseUrl("https://api.themoviedb.org/3/")
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(TmdbApi::class.java)
    }

    @Provides
    @Singleton
    fun provideMovieRepository(tmdbApi: TmdbApi): MovieRepository {
        return MovieRepositoryImpl(tmdbApi)
    }
}