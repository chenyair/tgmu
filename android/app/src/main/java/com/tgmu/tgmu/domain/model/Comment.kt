package com.tgmu.tgmu.domain.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize
import java.util.Date

@Parcelize
data class Comment(
    val userId: String,
    val text: String,
    val createdAt: Date,
) : Parcelable
