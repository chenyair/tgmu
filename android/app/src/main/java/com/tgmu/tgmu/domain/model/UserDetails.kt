package com.tgmu.tgmu.domain.model

import java.util.Date

data class UserDetails(
    val email: String,
    val fullName: String,
    val birthdate: Date,
    val authUid: String
)
