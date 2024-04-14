package com.tgmu.tgmu.domain.model

import java.util.Date

data class Experience(
    val id: String,
    val title: String,
    val movie_id: Int,
    val user_id: String,
    val description: String,
    val likedUsers: List<String>,
    val imgUrl: String,
    val comments: List<Comment>,
    val createdAt: Date,
) {
    fun toMap(): Map<String, Any> {
        return mapOf(
            "id" to id,
            "title" to title,
            "movie_id" to movie_id,
            "user_id" to user_id,
            "description" to description,
            "likedUsers" to likedUsers,
            "imgUrl" to imgUrl,
            "comments" to comments.map { it.toMap() },
            "createdAt" to createdAt
        )
    }
}