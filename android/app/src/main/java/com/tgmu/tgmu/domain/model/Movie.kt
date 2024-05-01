package com.tgmu.tgmu.domain.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class Movie(
    val id: Int,
    val title: String,
    val poster_path: String?,
    val genre_ids: List<Int>,
    val overview: String,
    val is_favorite: Boolean = false
) : Parcelable
