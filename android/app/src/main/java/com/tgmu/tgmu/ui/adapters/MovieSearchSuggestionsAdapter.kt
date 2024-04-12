package com.tgmu.tgmu.ui.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.AsyncListDiffer
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.RecyclerView
import com.tgmu.tgmu.databinding.ItemImageCardBinding
import com.tgmu.tgmu.databinding.ItemMovieSearchSuggestionBinding
import com.tgmu.tgmu.domain.model.Movie
import com.tgmu.tgmu.utils.Constants

class MovieSearchSuggestionsAdapter :
    RecyclerView.Adapter<MovieSearchSuggestionsAdapter.ViewHolder>() {
    inner class ViewHolder(var binding: ItemMovieSearchSuggestionBinding) :
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

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding =
            ItemMovieSearchSuggestionBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val movie = differ.currentList[position]
        holder.binding.apply {
            tvMovieTitle.text = movie.title
            tvMovieGenres.text = movie.genre_ids.joinToString (", ") {id ->
                Constants.GENRE_MAP[id] ?: ""
            }
        }

        holder.itemView.setOnClickListener {
            // TODO: Implement movie suggestion clicked
        }
    }

    override fun getItemCount(): Int = differ.currentList.size
}