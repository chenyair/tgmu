package com.tgmu.tgmu.domain.model

import java.util.Date

data class PopulatedComment(
    val userId: String,
    val text: String,
    val createdAt: Date,
    val userName: String,
    val userImageUrl: String
)
