package com.tgmu.tgmu.domain.model

import java.util.Date

data class UpdateUserDetailsForm(var fullName: String, var birthdate: Date, var imageUrl: String) {
    fun toUserDetails(email: String, authUid: String, imageUrl: String): UserDetails {
        return UserDetails(email, fullName, birthdate, authUid, imageUrl)
    }
}
