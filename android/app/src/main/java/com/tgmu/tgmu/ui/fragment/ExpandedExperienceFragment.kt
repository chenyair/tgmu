package com.tgmu.tgmu.ui.fragment

import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Paint
import android.os.Bundle
import android.view.LayoutInflater
import android.graphics.Color
import android.view.View
import android.view.ViewGroup
import android.view.WindowManager
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import androidx.recyclerview.widget.LinearLayoutManager
import com.bumptech.glide.Glide
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.google.android.material.bottomsheet.BottomSheetDialogFragment
import com.google.firebase.Firebase
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.auth
import com.tgmu.tgmu.R
import com.tgmu.tgmu.databinding.FragmentCommentsBottomSheetBinding
import com.tgmu.tgmu.databinding.FragmentExpandedExperienceBinding
import com.tgmu.tgmu.domain.model.Comment
import com.tgmu.tgmu.domain.model.Experience
import com.tgmu.tgmu.ui.adapters.ExperienceCommentAdapter
import com.tgmu.tgmu.ui.viewmodel.ExperienceViewModel
import com.tgmu.tgmu.utils.Resource
import dagger.hilt.android.AndroidEntryPoint
import org.ocpsoft.prettytime.PrettyTime
import java.util.Date
import java.util.Locale

@AndroidEntryPoint
class ExpandedExperienceFragment : Fragment() {
    class ExperienceCommentsBottomSheet(
        val comments: List<Comment>,
        val onNewComment: (Comment) -> Unit
    ) : BottomSheetDialogFragment() {
        private var _binding: FragmentCommentsBottomSheetBinding? = null
        private val binding get() = _binding!!
        private val auth: FirebaseAuth = Firebase.auth

        override fun onStart() {
            super.onStart()
            val dialog = dialog as BottomSheetDialog
            dialog.behavior.state = BottomSheetBehavior.STATE_EXPANDED
        }

        override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
        ): View? {
            _binding = FragmentCommentsBottomSheetBinding.inflate(inflater, container, false)
            return binding.root
        }


        override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
            super.onViewCreated(view, savedInstanceState)
            val commentAdapter = ExperienceCommentAdapter()
            binding.rvComments.apply {
                adapter = commentAdapter
                layoutManager = LinearLayoutManager(requireContext())
            }

            binding.apply {
                btnPostComment.setOnClickListener {
                    val comment = Comment(
                        auth.currentUser!!.uid,
                        etNewComment.text.toString(),
                        Date()
                    )
                    val comments = commentAdapter.differ.currentList
                    commentAdapter.differ.submitList(comments + comment)

                    etNewComment.text.clear()
                    onNewComment(comment)
                }
            }

            commentAdapter.differ.submitList(comments)
        }

        override fun onDestroyView() {
            super.onDestroyView()
            _binding = null
        }

        companion object {
            const val TAG = "CommentsBottomSheetDialog"
        }
    }

    private var _binding: FragmentExpandedExperienceBinding? = null
    private val binding get() = _binding!!
    private lateinit var auth: FirebaseAuth
    private val experienceViewModel: ExperienceViewModel by activityViewModels()

    private val expandedExperienceArgs: ExpandedExperienceFragmentArgs by navArgs()

    override fun onStart() {
        super.onStart()
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentExpandedExperienceBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        auth = Firebase.auth

        binding.apply {
            cvBack.setOnClickListener {
                findNavController().popBackStack()
            }

            expandedExperienceArgs.experience.let {
                tvMovieName.text = it.movieName
                tvLikeCount.text = it.likedUsers.size.toString()
                tvCommentCount.text = it.comments.size.toString()
                tvExperienceTitle.text = it.title
                tvExperienceDescription.text = it.description
                tvTimeAgo.text = formatToTimeAgo(it.createdAt)

                experienceViewModel.latestExperiences.observe(viewLifecycleOwner) { latestExperiences ->
                    if (latestExperiences is Resource.Success) {
                        val updatedExperience =
                            latestExperiences.data.find { experience -> experience.id == it.id }
                        bindLikes(this, updatedExperience!!)
                    }
                }

                bindLikes(this, it)


                val posterUrl = if (it.moviePoster.isEmpty()) {
                    "https://critics.io/img/movies/poster-placeholder.png"
                } else {
                    "https://image.tmdb.org/t/p/original/${it.moviePoster}"
                }

                Glide.with(this@ExpandedExperienceFragment)
                    .load(posterUrl)
                    .centerCrop()
                    .into(ivExperiencePoster)

//                val postingUser =
//                val defaultAvatar =
//                    generateInitialsBitmap(userDetails.fullName)
                Glide.with(this@ExpandedExperienceFragment)
                    .load(it.imgUrl)
//                    .error(defaultAvatar)
                    .into(civProfileImage)
                civProfileImage.bringToFront()

                Glide.with(this@ExpandedExperienceFragment)
                    .load(it.imgUrl)
                    .into(ivExperience)
            }
        }

        setupCommentsView()
    }

    private fun setupCommentsView() {
        val experience = expandedExperienceArgs.experience
        val commentsBottomSheetDialog = ExperienceCommentsBottomSheet(experience.comments) {
            experienceViewModel.addComment(experience.id!!, it)
        }

        binding.apply {
            tvCommentCount.text = experience.comments.size.toString()
            binding.apply {
                icComments.setOnClickListener { _ ->
                    commentsBottomSheetDialog.show(
                        requireActivity().supportFragmentManager,
                        ExperienceCommentsBottomSheet.TAG
                    )
                }
            }
        }
    }

    private fun bindLikes(binding: FragmentExpandedExperienceBinding, experience: Experience) {
        val currUserUID = auth.currentUser!!.uid

        binding.apply {
            tvLikeCount.text = experience.likedUsers.size.toString()

            var color = R.color.md_theme_onSurfaceVariant
            var icon = R.drawable.ic_like
            if (currUserUID in experience.likedUsers) {
                color = R.color.md_theme_error
                icon = R.drawable.ic_liked
            }

            icLikes.apply {
                setOnClickListener { _ ->
                    experienceViewModel.toggleLiked(experience, auth.currentUser!!.uid)
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

    private fun generateInitialsBitmap(fullName: String): Bitmap {
        val initials = fullName.split(" ").map { it.first() }.joinToString("").uppercase()
        val bitmap = Bitmap.createBitmap(100, 100, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bitmap)
        val paint = Paint().apply {
            color = Color.WHITE
            textSize = 40f
            textAlign = Paint.Align.CENTER
        }
        canvas.drawColor(resources.getColor(R.color.md_theme_tertiaryContainer, null))
        canvas.drawText(
            if (initials.length <= 2) initials else "${initials.first()}${initials.last()}",
            bitmap.width / 2f,
            bitmap.height / 2f - (paint.descent() + paint.ascent()) / 2,
            paint
        )
        return bitmap
    }

    private fun formatToTimeAgo(time: Date): String {
        val prettyTime = PrettyTime(Locale.getDefault())
        return prettyTime.format(time)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}