package com.tgmu.tgmu.ui.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import androidx.navigation.findNavController
import androidx.recyclerview.widget.AsyncListDiffer
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import com.tgmu.tgmu.R
import com.tgmu.tgmu.databinding.ItemCompactExperienceCardBinding
import com.tgmu.tgmu.domain.model.Experience
import org.ocpsoft.prettytime.PrettyTime
import java.util.Date
import java.util.Locale


class CompactExperienceAdapter(
    private val onCardClicked: (Experience) -> Unit,
    private val onLikeClicked: (Experience) -> Unit,
    private val onEditClicked: (Experience) -> Unit
) : RecyclerView.Adapter<CompactExperienceAdapter.ViewHolder>() {
    inner class ViewHolder(var binding: ItemCompactExperienceCardBinding) :
        RecyclerView.ViewHolder(binding.root)

    private val LIKED_USERS_PAYLOAD = "LIKED_USERS_PAYLOAD"

    private val differCallback = object : DiffUtil.ItemCallback<Experience>() {
        override fun areItemsTheSame(oldItem: Experience, newItem: Experience): Boolean {
            return oldItem.id == newItem.id
        }

        override fun areContentsTheSame(oldItem: Experience, newItem: Experience): Boolean {
            return oldItem == newItem
        }

        override fun getChangePayload(oldItem: Experience, newItem: Experience): Any? =
            if (oldItem.likedUsers != newItem.likedUsers) {
                LIKED_USERS_PAYLOAD
            } else null
    }

    val differ = AsyncListDiffer(this, differCallback)

    override fun onCreateViewHolder(
        parent: ViewGroup, viewType: Int
    ): CompactExperienceAdapter.ViewHolder {
        val binding = ItemCompactExperienceCardBinding.inflate(
            LayoutInflater.from(parent.context), parent, false
        )
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val experience = differ.currentList[position]
        val currUserUID = Firebase.auth.currentUser!!.uid
        holder.binding.apply {
            tvMovieName.text = experience.movieName
            tvExperienceTitle.text = experience.title
            tvCommentCount.text = experience.comments.size.toString()

            // Value of alpha is between 0-255. Therefore 10% * 255
            chipExperienceTimeAgo.background.alpha = (255 * 0.10).toInt()
            chipExperienceTimeAgo.text = formatToTimeAgo(experience.createdAt)

            val posterUrl = if (experience.moviePoster.isEmpty()) {
                "https://critics.io/img/movies/poster-placeholder.png"
            } else {
                "https://image.tmdb.org/t/p/original/${experience.moviePoster}"
            }

            Glide.with(holder.itemView.context)
                .load(posterUrl)
                .centerCrop()
                .into(ivExperiencePoster)

            bindLikes(this, experience)
        }
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int, payloads: MutableList<Any>) {
        when (val latestPayload = payloads.lastOrNull()) {
            LIKED_USERS_PAYLOAD -> {
                val experience = differ.currentList[position]
                val binding = holder.binding
                scaleImageView(binding.icLikes)
                bindLikes(binding, experience)
            }

            else -> {
                onBindViewHolder(holder, position)
            }
        }

        holder.binding.apply {
            setupEditButton(this, differ.currentList[position])
            root.setOnClickListener {
                onCardClicked(differ.currentList[position])
            }
        }

    }

    private fun bindLikes(binding: ItemCompactExperienceCardBinding, experience: Experience) {
        val currUserUID = Firebase.auth.currentUser!!.uid

        binding.apply {
            tvLikeCount.text = experience.likedUsers.size.toString()

            var color = R.color.md_theme_onSurfaceVariant
            var icon = R.drawable.ic_like
            if (currUserUID in experience.likedUsers) {
                color = R.color.md_theme_error
                icon = R.drawable.ic_liked
            }

            icLikes.apply {
                setOnClickListener {
                    onLikeClicked(experience)
                }
                setImageResource(icon)
                drawable.setTint(
                    context.resources.getColor(
                        color, null
                    )
                )
            }
        }
    }

    private fun formatToTimeAgo(time: Date): String {
        val prettyTime = PrettyTime(Locale.getDefault())
        return prettyTime.format(time)
    }

    private fun scaleImageView(imageView: ImageView) {
        imageView.animate().scaleX(1.2f) // increase scale to 120%
            .scaleY(1.2f).setDuration(100) // duration of the scale up animation
            .withEndAction {
                // scale down after the scale up animation ends
                imageView.animate().scaleX(1f) // back to original size
                    .scaleY(1f).setDuration(100) // duration of the scale down animation
                    .start()
            }.start()
    }

    private fun setupEditButton(binding: ItemCompactExperienceCardBinding, experience: Experience) {
        val currUserUID = Firebase.auth.currentUser!!.uid
        binding.icEdit.apply {
            if (currUserUID == experience.userId) {
                visibility = View.VISIBLE
                setOnClickListener {
                    onEditClicked(experience)
                }
            } else {
                visibility = View.GONE
            }
        }
    }

    override fun getItemCount(): Int = differ.currentList.size
}
