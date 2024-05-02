package com.tgmu.tgmu.ui.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.AsyncListDiffer
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.tgmu.tgmu.databinding.ItemExperienceCommentBinding
import com.tgmu.tgmu.domain.model.Comment
import org.ocpsoft.prettytime.PrettyTime
import java.util.Date
import java.util.Locale

class ExperienceCommentAdapter : RecyclerView.Adapter<ExperienceCommentAdapter.ViewHolder>() {
    inner class ViewHolder(var binding: ItemExperienceCommentBinding) :
        RecyclerView.ViewHolder(binding.root)

    private val differCallback = object : DiffUtil.ItemCallback<Comment>() {
        override fun areItemsTheSame(oldItem: Comment, newItem: Comment): Boolean {
            return oldItem.user_id == newItem.user_id && oldItem.createdAt == newItem.createdAt
        }

        override fun areContentsTheSame(oldItem: Comment, newItem: Comment): Boolean {
            return oldItem == newItem
        }
    }

    val differ = AsyncListDiffer(this, differCallback)

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): ExperienceCommentAdapter.ViewHolder {
        val binding = ItemExperienceCommentBinding.inflate(
            LayoutInflater.from(parent.context), parent, false
        )
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ExperienceCommentAdapter.ViewHolder, position: Int) {
        val comment = differ.currentList[position]
        holder.binding.apply {
            tvComment.text = comment.text
            tvUserName.text = comment.user_id
            tvTimeAgo.text = formatToTimeAgo(comment.createdAt)
            Glide.with(root)
                .load("https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg")
                .into(civProfileImage)
        }
    }

    private fun formatToTimeAgo(time: Date): String {
        val prettyTime = PrettyTime(Locale.getDefault())
        return prettyTime.format(time)
    }


    override fun getItemCount(): Int = differ.currentList.size
}