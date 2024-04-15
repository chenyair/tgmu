package com.tgmu.tgmu.domain.model

import java.util.Date

data class Experience(
    val id: String,
    val title: String,
    val movieId: Int,
    val movieName: String,
    val moviePoster: String,
    val userId: String,
    val description: String,
    val likedUsers: List<String>,
    val imgUrl: String,
    val comments: List<Comment>,
    val createdAt: Date,
)