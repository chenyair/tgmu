package com.tgmu.tgmu.data.remote

import com.google.firebase.firestore.PropertyName
import java.util.Date

data class FirestoreUserDetails(
    val email: String = "",
    @get:PropertyName("full_name") @set:PropertyName("full_name") var fullName: String = "",
    val birthdate: Date = Date(),
    @get:PropertyName("auth_uid") @set:PropertyName("auth_uid") var authUid: String = "",
    @get:PropertyName("image_url") @set:PropertyName("image_url") var imageUrl: String = ""
)
