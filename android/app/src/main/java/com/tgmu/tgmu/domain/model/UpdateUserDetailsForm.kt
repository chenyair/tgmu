package com.tgmu.tgmu.domain.model

import java.util.Date

data class UpdateUserDetailsForm(var fullName: String, var birthdate: Date) {
    fun toUserDetails(email: String, authUid: String): UserDetails {
        return UserDetails(email, fullName, birthdate, authUid)
    }
}
