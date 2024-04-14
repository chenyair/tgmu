package com.tgmu.tgmu.data.remote

import com.google.firebase.firestore.PropertyName
import java.util.Date

data class FirestoreUserDetails(
    val email: String = "",

    @set:PropertyName("full_name")
    @get:PropertyName("full_name")
    var fullName: String = "",

    val birthdate: Date = Date()
)
