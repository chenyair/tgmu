package com.tgmu.tgmu.data.mapper

import com.tgmu.tgmu.data.remote.FirestoreExperience
import com.tgmu.tgmu.domain.model.Comment
import com.tgmu.tgmu.domain.model.Experience

// Generate extension that parses FirestoreExperience to Experience

fun FirestoreExperience.Comment.toModel(): Comment =
    Comment(
        user_id = userId,
        text = text,
        createdAt = createdAt
    )

fun FirestoreExperience.toModel(): Experience =
    Experience(
        id = id ?: "",
        title = title,
        movieId = movieId,
        userId = userId,
        description = description,
        likedUsers = likedUsers,
        imgUrl = imgUrl,
        comments = comments.map { it.toModel() },
        movieName = movieName,
        moviePoster = moviePoster,
        createdAt = createdAt
    )

fun Comment.toFirestoreObject(): FirestoreExperience.Comment = FirestoreExperience.Comment(
    userId = user_id,
    text = text,
    createdAt = createdAt
)
fun Experience.toFirestoreObject(): FirestoreExperience = FirestoreExperience(
    id = id,
    title = title,
    movieId = movieId,
    userId = userId,
    description = description,
    likedUsers = likedUsers,
    imgUrl = imgUrl,
    comments = comments.map { it.toFirestoreObject() },
    movieName = movieName,
    moviePoster = moviePoster,
    createdAt = createdAt
)