package com.tgmu.tgmu.data.mapper

import com.tgmu.tgmu.data.local.MovieEntity
import com.tgmu.tgmu.data.remote.*
import com.tgmu.tgmu.domain.model.Movie


// Generate extension function that parse it from local db room entity to domain model
fun MovieEntity.toModel(): Movie {
    return Movie(
        id = id,
        title = title,
        poster_path = posterPath,
        genre_ids = genreIds,
        overview = overview,
        is_favorite = isFavorite
    )
}

fun TmdbMovie.toModel(): Movie {
    return Movie(
        id = id,
        title = title,
        poster_path = poster_path,
        genre_ids = genre_ids,
        overview = overview
    )
}

fun TmdbMovieList.toModel(): List<Movie> {
    return results.map { it.toModel() }
}

fun Movie.toEntity(): MovieEntity {
    return MovieEntity(
        id = id,
        title = title,
        posterPath = poster_path,
        genreIds = genre_ids,
        overview = overview,
        isFavorite = is_favorite
    )
}
