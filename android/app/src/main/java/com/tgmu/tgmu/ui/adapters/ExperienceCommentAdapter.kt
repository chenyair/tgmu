package com.tgmu.tgmu.ui.adapters

import android.content.Context
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.AsyncListDiffer
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.tgmu.tgmu.R
import com.tgmu.tgmu.databinding.ItemExperienceCommentBinding
import com.tgmu.tgmu.domain.model.Comment
import com.tgmu.tgmu.domain.model.PopulatedComment
import org.ocpsoft.prettytime.PrettyTime
import java.util.Date
import java.util.Locale

class ExperienceCommentAdapter : RecyclerView.Adapter<ExperienceCommentAdapter.ViewHolder>() {
    inner class ViewHolder(var binding: ItemExperienceCommentBinding) :
        RecyclerView.ViewHolder(binding.root)

    private val differCallback = object : DiffUtil.ItemCallback<PopulatedComment>() {
        override fun areItemsTheSame(
            oldItem: PopulatedComment,
            newItem: PopulatedComment
        ): Boolean {
            return oldItem.userId == newItem.userId && oldItem.createdAt == newItem.createdAt
        }

        override fun areContentsTheSame(
            oldItem: PopulatedComment,
            newItem: PopulatedComment
        ): Boolean {
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
            tvUserName.text = comment.userName
            tvTimeAgo.text = formatToTimeAgo(comment.createdAt)
            val context = holder.itemView.context
            val defaultAvatar =
                generateInitialsBitmap(context, comment.userName)
            Glide.with(context)
                .load(defaultAvatar)
                .into(civProfileImage)
            civProfileImage.bringToFront()
        }
    }

    private fun formatToTimeAgo(time: Date): String {
        val prettyTime = PrettyTime(Locale.getDefault())
        return prettyTime.format(time)
    }

    private fun generateInitialsBitmap(
        context: Context,
        fullName: String
    ): Bitmap {
        val initials = fullName.split(" ").map { it.first() }.joinToString("").uppercase()
        val bitmap = Bitmap.createBitmap(100, 100, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bitmap)
        val paint = Paint().apply {
            color = Color.WHITE
            textSize = 40f
            textAlign = Paint.Align.CENTER
        }
        canvas.drawColor(ContextCompat.getColor(context, R.color.md_theme_tertiaryContainer))
        canvas.drawText(
            if (initials.length <= 2) initials else "${initials.first()}${initials.last()}",
            bitmap.width / 2f,
            bitmap.height / 2f - (paint.descent() + paint.ascent()) / 2,
            paint
        )
        return bitmap
    }

    override fun getItemCount(): Int = differ.currentList.size
}