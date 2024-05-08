package com.tgmu.tgmu.domain.model

import android.net.Uri
import java.util.Date

data class ExperienceForm(
    var title: String = "",
    var description: String = "",
    var movieId: Int? = null,
    var moviePoster: String? = null,
    var movieName: String? = null,
    var imgFileUri: Uri? = null,
    var existingImgUrl: String = ""
) {
    fun toExperience(userId: String, imgUrl: String = existingImgUrl, initialExperience: Experience? = null): Experience {
        return Experience(
            id = initialExperience?.id, // null if no initial experience
            userId = userId,
            title = title,
            description = description,
            movieId = movieId!!,
            imgUrl = imgUrl,
            moviePoster = moviePoster ?: "",
            movieName = movieName!!,
            comments = initialExperience?.comments ?: emptyList(),
            createdAt = initialExperience?.createdAt ?: Date(),
            likedUsers = initialExperience?.likedUsers ?: emptyList(),
        )
    }
}
