package com.tgmu.tgmu.domain.model

import java.util.Date

data class Comment(
    val user_id: String,
    val text: String,
    val createdAt: Date,
) {
    fun toMap(): Map<String, Any> {
        return mapOf(
            "user_id" to user_id,
            "text" to text,
            "createdAt" to createdAt
        )
    }
}
