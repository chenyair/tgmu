package com.tgmu.tgmu.data.remote

import com.google.firebase.firestore.DocumentId
import com.google.firebase.firestore.PropertyName
import java.util.Date

data class FirestoreExperience(
    @DocumentId
    var id: String? = null,
    var title: String = "",
    @get:PropertyName("movie_id") @set:PropertyName("movie_id") var movieId: Int = 1,
    @get:PropertyName("movie_poster") @set:PropertyName("movie_poster") var moviePoster: String = "",
    @get:PropertyName("movie_name") @set:PropertyName("movie_name") var movieName: String = "",
    @get:PropertyName("user_id") @set:PropertyName("user_id") var userId: String = "1",
    var description: String = "",
    @get:PropertyName("liked_users") @set:PropertyName("liked_users") var likedUsers: List<String> = listOf<String>(),
    @get:PropertyName("img_url") @set:PropertyName("img_url") var imgUrl: String = "",
    var comments: List<Comment> = listOf(),
    @get:PropertyName("created_at") @set:PropertyName("created_at") var createdAt: Date = Date(),
) {
    data class Comment(
        @get:PropertyName("user_id") @set:PropertyName("user_id") var userId: String = "1",
        var text: String = "",
        @get:PropertyName("created_at") @set:PropertyName("created_at") var createdAt: Date = Date(),
    )
}
