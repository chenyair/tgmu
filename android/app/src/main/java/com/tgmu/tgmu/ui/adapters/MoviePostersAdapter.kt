package com.tgmu.tgmu.ui.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import android.widget.ImageView
import androidx.recyclerview.widget.AsyncListDiffer
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.google.android.material.card.MaterialCardView
import com.tgmu.tgmu.R
import com.tgmu.tgmu.databinding.ItemMoviePosterBinding
import com.tgmu.tgmu.domain.model.Movie

class MoviePostersAdapter(private val onPosterClicked: (Movie, MaterialCardView) -> Unit) :
    RecyclerView.Adapter<MoviePostersAdapter.ViewHolder>() {

    inner class ViewHolder(var binding: ItemMoviePosterBinding) :
        RecyclerView.ViewHolder(binding.root)

    private val differCallback = object : DiffUtil.ItemCallback<Movie>() {
        override fun areItemsTheSame(oldItem: Movie, newItem: Movie): Boolean {
            return oldItem.id == newItem.id
        }

        override fun areContentsTheSame(oldItem: Movie, newItem: Movie): Boolean {
            return oldItem == newItem
        }
    }

    val differ = AsyncListDiffer(this, differCallback)

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): MoviePostersAdapter.ViewHolder {
        val binding =
            ItemMoviePosterBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: MoviePostersAdapter.ViewHolder, position: Int) {
        val movie = differ.currentList[position]
        val context = holder.itemView.context
        val transitionName =
            "${context.getString(R.string.transition_name_movie_poster)}${movie.id}"
        holder.binding.apply {
            Glide
                .with(holder.itemView.context)
                .load("https://image.tmdb.org/t/p/original/${movie.poster_path ?: ""}")
                .centerCrop()
                .into(ivMoviePoster)
            cwMoviePoster.transitionName = transitionName
            ivMoviePoster.setOnClickListener {
                onPosterClicked(movie, cwMoviePoster)
            }

        }
    }

    override fun getItemCount(): Int = differ.currentList.size

}