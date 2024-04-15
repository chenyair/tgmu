package com.tgmu.tgmu.data.mapper

import com.tgmu.tgmu.data.remote.FirestoreUserDetails
import com.tgmu.tgmu.domain.model.UserDetails


fun FirestoreUserDetails.toModel() = UserDetails(
    email = email!!,
    fullName = fullName!!,
    birthdate = birthdate!!
)

fun UserDetails.toFirestoreObject() = FirestoreUserDetails(
    email = email,
    fullName = fullName,
    birthdate = birthdate
)