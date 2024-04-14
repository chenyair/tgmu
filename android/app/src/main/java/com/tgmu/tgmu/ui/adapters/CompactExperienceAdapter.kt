package com.tgmu.tgmu.ui.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.AsyncListDiffer
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.RecyclerView
import com.tgmu.tgmu.databinding.ItemCompactExperienceCardBinding
import com.tgmu.tgmu.domain.model.Experience
import org.ocpsoft.prettytime.PrettyTime
import java.util.Date
import java.util.Locale


class CompactExperienceAdapter : RecyclerView.Adapter<CompactExperienceAdapter.ViewHolder>() {
    inner class ViewHolder(var binding: ItemCompactExperienceCardBinding) :
        RecyclerView.ViewHolder(binding.root)

    private val differCallback = object : DiffUtil.ItemCallback<Experience>() {
        override fun areItemsTheSame(oldItem: Experience, newItem: Experience): Boolean {
            return oldItem.id == newItem.id
        }

        override fun areContentsTheSame(oldItem: Experience, newItem: Experience): Boolean {
            return oldItem == newItem
        }
    }

    val differ = AsyncListDiffer(this, differCallback)

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): CompactExperienceAdapter.ViewHolder {
        val binding =
            ItemCompactExperienceCardBinding.inflate(
                LayoutInflater.from(parent.context),
                parent,
                false
            )
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val experience = differ.currentList[position]
        holder.binding.apply {
            tvExperienceMovieTitle.text = experience.movie_id.toString()
            tvExperienceName.text = experience.title
            chipExperienceTimeAgo.text = formatToTimeAgo(experience.createdAt)
            tvLikeCount.text = experience.likedUsers.size.toString()
            tvCommentCount.text = experience.comments.size.toString()

            // TODO: implement case liked button
        }
    }

    private fun formatToTimeAgo(time: Date): String {
        val prettyTime = PrettyTime(Locale.getDefault())
        return prettyTime.format(time)
    }

    override fun getItemCount(): Int = differ.currentList.size
}
