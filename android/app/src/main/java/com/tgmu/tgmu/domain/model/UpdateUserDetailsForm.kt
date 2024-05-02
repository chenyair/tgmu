package com.tgmu.tgmu.domain.model

import java.util.Date

data class UpdateUserDetailsForm(var fullName: String, var birthdate: Date, var email: String) {
    fun toUserDetails(): UserDetails {
        return UserDetails(email, fullName, birthdate)
    }
}
