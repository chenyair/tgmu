package com.tgmu.tgmu.ui.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.AsyncListDiffer
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.tgmu.tgmu.databinding.ItemImageCardBinding
import com.tgmu.tgmu.domain.model.Movie

class PopularMoviesAdapter : RecyclerView.Adapter<PopularMoviesAdapter.ViewHolder>() {

    inner class ViewHolder(var binding: ItemImageCardBinding) :
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
    ): PopularMoviesAdapter.ViewHolder {
        val binding =
            ItemImageCardBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: PopularMoviesAdapter.ViewHolder, position: Int) {
        val movie = differ.currentList[position]
        holder.binding.apply {
            Glide
                .with(holder.itemView.context)
                .load("https://image.tmdb.org/t/p/original/${movie.poster_path ?: ""}")
                .centerCrop()
                .into(ivMoviePoster)
        }
    }

    override fun getItemCount(): Int = differ.currentList.size

}