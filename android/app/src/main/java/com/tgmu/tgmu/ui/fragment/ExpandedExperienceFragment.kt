package com.tgmu.tgmu.ui.fragment

import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Paint
import android.os.Bundle
import android.view.LayoutInflater
import android.graphics.Color
import android.graphics.Rect
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import androidx.recyclerview.widget.LinearLayoutManager
import com.bumptech.glide.Glide
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.google.android.material.bottomsheet.BottomSheetDialogFragment
import com.google.android.material.snackbar.Snackbar
import com.google.firebase.Firebase
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.auth
import com.tgmu.tgmu.R
import com.tgmu.tgmu.databinding.FragmentCommentsBottomSheetBinding
import com.tgmu.tgmu.databinding.FragmentExpandedExperienceBinding
import com.tgmu.tgmu.domain.model.Comment
import com.tgmu.tgmu.domain.model.Experience
import com.tgmu.tgmu.domain.model.PopulatedComment
import com.tgmu.tgmu.domain.model.UserDetails
import com.tgmu.tgmu.ui.adapters.ExperienceCommentAdapter
import com.tgmu.tgmu.ui.viewmodel.ExpandedExperienceViewModel
import com.tgmu.tgmu.ui.viewmodel.ExperienceViewModel
import com.tgmu.tgmu.ui.viewmodel.UsersDetailsViewModel
import com.tgmu.tgmu.utils.Resource
import dagger.hilt.android.AndroidEntryPoint
import org.ocpsoft.prettytime.PrettyTime
import java.util.Date
import java.util.Locale
import javax.inject.Inject

@AndroidEntryPoint
class ExpandedExperienceFragment : Fragment() {

    @AndroidEntryPoint
    class ExperienceCommentsBottomSheet(
        val comments: List<PopulatedComment>,
        val onNewComment: (Comment) -> Unit
    ) : BottomSheetDialogFragment() {
        private var _binding: FragmentCommentsBottomSheetBinding? = null
        private val binding get() = _binding!!

        @Inject
        lateinit var usersDetailsViewModel: UsersDetailsViewModel

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

            commentAdapter.differ.submitList(comments.asReversed()) {
                binding.apply {
                    rvComments.apply {
                        adapter = commentAdapter
                        layoutManager = LinearLayoutManager(requireContext())
                    }

                    btnPostComment.setOnClickListener {
                        val comment = Comment(
                            auth.currentUser!!.uid,
                            etNewComment.text.toString(),
                            Date()
                        )
                        val currComments = commentAdapter.differ.currentList
                        val currUser =
                            usersDetailsViewModel.currentUserDetails.value as Resource.Success
                        val newPopulatedComment = PopulatedComment(
                            comment.userId,
                            comment.text,
                            comment.createdAt,
                            currUser.data.fullName
                        )
                        commentAdapter.differ.submitList(listOf(newPopulatedComment) + currComments) {
                            binding.rvComments.layoutManager!!.scrollToPosition(0)
                        }
                        etNewComment.text.clear()
                        onNewComment(comment)
                    }
                }
            }

            binding.root.viewTreeObserver.addOnGlobalLayoutListener {
                val r = Rect()
                binding.root.getWindowVisibleDisplayFrame(r)
                val screenHeight = binding.root.rootView.height

                val keypadHeight = screenHeight - r.bottom
                val params = binding.rvComments.layoutParams
                val density = resources.displayMetrics.density

                if (keypadHeight > screenHeight * 0.15) {
                    params.height = (200 * density).toInt()
                    binding.rvComments.layoutParams = params
                } else {
                    params.height = (400 * density).toInt()
                    binding.rvComments.layoutParams = params
                }
            }
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
    private val expandedExperienceViewModel: ExpandedExperienceViewModel by viewModels()

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
        expandedExperienceViewModel.populateComments(expandedExperienceArgs.experience.comments)
        expandedExperienceViewModel.fetchUserDetails(expandedExperienceArgs.experience.userId)

        binding.apply {

            cvBack.setOnClickListener {
                findNavController().popBackStack()
            }

            expandedExperienceViewModel.currExperienceUserDetails.observe(viewLifecycleOwner) { userDetails ->
                when (userDetails) {
                    is Resource.Loading -> {
                        cpiExpandedExperience.visibility = View.VISIBLE
                    }

                    is Resource.Success -> {
                        cpiExpandedExperience.visibility = View.GONE
                        initializeView(this, userDetails.data)
                        setupCommentsView()
                    }

                    is Resource.Failed -> {
                        cpiExpandedExperience.visibility = View.GONE
                        Snackbar.make(
                            requireView(),
                            getString(
                                R.string.something_went_wrong,
                            ),
                            Snackbar.LENGTH_LONG
                        ).show()
                    }
                }
            }
        }
    }

    private fun setupCommentsView() {
        expandedExperienceViewModel.currExperiencePopulatedComments.observe(viewLifecycleOwner) { populatedComments ->
            experienceViewModel.latestExperiences.observe(viewLifecycleOwner) { latestExperiences ->
                if (latestExperiences is Resource.Success) {
                    val experience =
                        latestExperiences.data.find { it.id == expandedExperienceArgs.experience.id }!!
                    if (populatedComments is Resource.Success) {
                        val commentsBottomSheetDialog =
                            ExperienceCommentsBottomSheet(populatedComments.data) {
                                experienceViewModel.addComment(experience.id!!, it)
                            }

                        binding.apply {
                            tvCommentCount.text = experience.comments.size.toString()
                            icComments.setOnClickListener { _ ->
                                commentsBottomSheetDialog.show(
                                    requireActivity().supportFragmentManager,
                                    ExperienceCommentsBottomSheet.TAG
                                )
                            }
                        }
                    }
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

    private fun initializeView(
        binding: FragmentExpandedExperienceBinding,
        userDetails: UserDetails
    ) {
        val experience = expandedExperienceArgs.experience
        binding.apply {
            tvMovieName.text = experience.movieName
            tvUserName.text = userDetails.fullName
            icLikes.visibility = View.VISIBLE
            tvLikeCount.text = experience.likedUsers.size.toString()
            icComments.visibility = View.VISIBLE
            tvCommentCount.text = experience.comments.size.toString()
            tvExperienceTitle.text = experience.title
            tvExperienceDescription.text = experience.description
            tvTimeAgo.text = formatToTimeAgo(experience.createdAt)

            experienceViewModel.latestExperiences.observe(viewLifecycleOwner) { latestExperiences ->
                if (latestExperiences is Resource.Success) {
                    val updatedExperience =
                        latestExperiences.data.find { e -> e.id == experience.id }
                    bindLikes(this, updatedExperience!!)
                }
            }

            bindLikes(this, experience)

            val posterUrl = if (experience.moviePoster.isEmpty()) {
                "https://critics.io/img/movies/poster-placeholder.png"
            } else {
                "https://image.tmdb.org/t/p/original/${experience.moviePoster}"
            }

            Glide.with(this@ExpandedExperienceFragment)
                .load(posterUrl)
                .centerCrop()
                .into(ivExperiencePoster)

            val userBitMap =
                generateInitialsBitmap(userDetails.fullName)
            Glide.with(this@ExpandedExperienceFragment)
                .load(userBitMap)
                .into(civProfileImage)
            civProfileImage.bringToFront()

            Glide.with(this@ExpandedExperienceFragment)
                .load(experience.imgUrl)
                .into(ivExperience)
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