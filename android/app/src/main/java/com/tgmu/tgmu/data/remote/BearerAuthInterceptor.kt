package com.tgmu.tgmu.data.remote

import okhttp3.Interceptor

class BearerAuthInterceptor(private val token: String): Interceptor {
    override fun intercept(chain: Interceptor.Chain): okhttp3.Response {
        val request = chain.request().newBuilder()
            .header("Authorization", "Bearer $token").build()
        return chain.proceed(request)
    }
}