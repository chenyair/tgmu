package com.tgmu.tgmu.data.mapper

import com.tgmu.tgmu.data.remote.FirestoreExperience
import com.tgmu.tgmu.domain.model.Comment
import com.tgmu.tgmu.domain.model.Experience

// Generate extension that parses FirestoreExperience to Experience

fun FirestoreExperience.Comment.toModel(): Comment {
    return Comment(
        user_id = user_id,
        text = text,
        createdAt = createdAt
    )
}
fun FirestoreExperience.toModel(): Experience {
    return Experience(
        id = id,
        title = title,
        movie_id = movie_id,
        user_id = user_id,
        description = description,
        likedUsers = likedUsers,
        imgUrl = imgUrl,
        comments = comments.map { it.toModel() },
        createdAt = createdAt
    )
}
