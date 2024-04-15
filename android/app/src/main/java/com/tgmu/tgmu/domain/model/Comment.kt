package com.tgmu.tgmu.domain.model

import java.util.Date

data class Comment(
    val user_id: String,
    val text: String,
    val createdAt: Date,
)