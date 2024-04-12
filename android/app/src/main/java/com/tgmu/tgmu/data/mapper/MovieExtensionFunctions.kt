package com.tgmu.tgmu.data.mapper

import com.tgmu.tgmu.data.local.MovieEntity
import com.tgmu.tgmu.data.remote.*
import com.tgmu.tgmu.domain.model.Movie


// Generate extension function that parse it from local db room entity to domain model
fun MovieEntity.toModel(): Movie {
    return Movie(
        id = id,
        title = "title"
    )
}

fun TmdbMovie.toModel(): Movie {
    return Movie(
        id = id,
        title = title
    )
}

fun TmdbMovieList.toModel(): List<Movie> {
    return results.map { it.toModel() }
}
