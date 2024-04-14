package com.tgmu.tgmu.data.remote

import java.util.Date

data class FirestoreUserDetails(
    val email: String = "",
    val fullName: String = "",
    val birthdate: Date = Date()
)
