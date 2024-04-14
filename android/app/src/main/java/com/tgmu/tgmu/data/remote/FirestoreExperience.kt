package com.tgmu.tgmu.data.remote

import java.util.Date

data class FirestoreExperience(
    val id: String,
    val title: String,
    val movie_id: Int,
    val user_id: Int,
    val description: String,
    val likedUsers: List<Int>,
    val imgUrl: String,
    val comments: List<Comment>,
    val createdAt: Date,
) {
    data class Comment(
        val user_id: String,
        val text: String,
        val createdAt: Date,
    )
}
