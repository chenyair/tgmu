package com.tgmu.tgmu.domain.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize
import java.util.Date

@Parcelize
data class Experience(
    val id: String?,
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
) : Parcelable
