package com.tgmu.tgmu.data.remote

import java.util.Date

data class FirestoreExperience(
    val id: String = "",
    val title: String = "",
    val movie_id: Int = 1,
    val user_id: String = "1",
    val description: String = "",
    val likedUsers: List<String> = listOf<String>(),
    val imgUrl: String = "",
    val comments: List<Comment> = listOf<Comment>(),
    val createdAt: Date = Date(),
) {
    data class Comment(
        val user_id: String = "1",
        val text: String = "",
        val createdAt: Date = Date(),
    )
}
