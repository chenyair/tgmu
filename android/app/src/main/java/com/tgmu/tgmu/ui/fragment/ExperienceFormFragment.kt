package com.tgmu.tgmu.ui.fragment

import android.content.Context
import android.graphics.drawable.Drawable
import android.net.Uri
import android.os.Bundle
import android.view.LayoutInflater
import android.view.MotionEvent
import com.bumptech.glide.request.target.Target
import android.view.View
import android.view.ViewGroup
import android.view.inputmethod.InputMethodManager
import android.widget.EditText
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.widget.addTextChangedListener
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.fragment.app.viewModels
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import androidx.recyclerview.widget.LinearLayoutManager
import com.bumptech.glide.Glide
import com.bumptech.glide.load.DataSource
import com.bumptech.glide.load.engine.GlideException
import com.bumptech.glide.request.RequestListener
import com.google.android.material.search.SearchView
import com.google.android.material.snackbar.Snackbar
import com.tgmu.tgmu.R
import com.tgmu.tgmu.databinding.FragmentExperienceFormBinding
import com.tgmu.tgmu.domain.model.Experience
import com.tgmu.tgmu.ui.adapters.MovieSearchSuggestionsAdapter
import com.tgmu.tgmu.ui.viewmodel.ExperienceViewModel
import com.tgmu.tgmu.ui.viewmodel.MoviesViewModel
import com.tgmu.tgmu.utils.Constants
import com.tgmu.tgmu.utils.Resource
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@AndroidEntryPoint
class ExperienceFormFragment : Fragment() {
    private var _binding: FragmentExperienceFormBinding? = null
    private val binding get(): FragmentExperienceFormBinding = _binding!!
    private val experienceViewModel: ExperienceViewModel by activityViewModels()
    private val moviesViewModel: MoviesViewModel by viewModels()
    private val experienceFormArgs: ExperienceFormFragmentArgs by navArgs()

    private val selectImageLauncher =
        registerForActivityResult(ActivityResultContracts.GetContent()) { uri: Uri? ->
            uri?.let {
                lifecycleScope.launch {
                    experienceViewModel.changeExperienceFormData(imgFileUri = it)
                    showImageFromFile(it)
                }
            }
        }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentExperienceFormBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.apply {
            root.setOnTouchListener { _, event ->
                if (event.action == MotionEvent.ACTION_DOWN) {
                    val view = activity?.currentFocus
                    if (view is EditText) {
                        val imm =
                            activity?.getSystemService(Context.INPUT_METHOD_SERVICE) as? InputMethodManager
                        imm?.hideSoftInputFromWindow(view.windowToken, 0)
                        view.clearFocus()
                    }
                }
                false
            }

            if (experienceFormArgs.previewExperience != null) {
                val experience = experienceFormArgs.previewExperience!!
                experienceViewModel.changeExperienceFormData(
                    title = experience.title,
                    description = experience.description,
                    movieName = experience.movieName,
                    movieId = experience.movieId,
                    moviePoster = experience.moviePoster,
                    existingImgUrl = experience.imgUrl
                )
                setupEditView(experienceFormArgs.previewExperience!!)
            }

            fabBack.setOnClickListener {
                findNavController().popBackStack()
            }
            fabPost.setOnClickListener {
                experienceViewModel.postExperience(experienceFormArgs.previewExperience)
                watchExperienceUpload()
            }
            fabUploadImage.setOnClickListener {
                selectImageLauncher.launch("image/*")
            }
            fabEditImage.setOnClickListener {
                selectImageLauncher.launch("image/*")
            }
            tiTitle.addTextChangedListener {
                experienceViewModel.changeExperienceFormData(title = it.toString())
            }
            tiDescription.addTextChangedListener {
                experienceViewModel.changeExperienceFormData(description = it.toString())
            }
            experienceViewModel.apply {
                experienceForm.observe(viewLifecycleOwner) { value ->
                    validateForm()
                }
            }
        }

        val searchAdapter = MovieSearchSuggestionsAdapter {
            binding.apply {
                sbMovie.setText(it.title)
                svMovie.hide()
                llNoSelectionPlaceholder.visibility = View.GONE
                clAddExperienceForm.visibility = View.VISIBLE
            }

            experienceViewModel.changeExperienceFormData(
                moviePoster = it.poster_path,
                movieId = it.id,
                movieName = it.title
            )
        }

        setupSearchView(searchAdapter)
    }

    private fun setupEditView(experience: Experience) {
        binding.apply {
            tiTitle.setText(experience.title)
            tvPostExperience.setText(getString(R.string.edit_experience))
            tiDescription.setText(experience.description)
            fabUploadImage.visibility = View.GONE
            fabEditImage.visibility = View.VISIBLE
            cpiExperienceImage.visibility = View.VISIBLE
            Glide
                .with(requireContext())
                .load(experience.imgUrl)
                .listener(object : RequestListener<Drawable> {
                    override fun onLoadFailed(
                        e: GlideException?,
                        model: Any?,
                        target: Target<Drawable>,
                        isFirstResource: Boolean
                    ): Boolean {
                        ivExperience.visibility = View.GONE
                        cpiExperienceImage.visibility = View.GONE
                        Toast.makeText(requireContext(), "Error loading image", Toast.LENGTH_SHORT)
                            .show()
                        return false
                    }

                    override fun onResourceReady(
                        resource: Drawable,
                        model: Any,
                        target: Target<Drawable>?,
                        dataSource: DataSource,
                        isFirstResource: Boolean
                    ): Boolean {
                        cpiExperienceImage.visibility = View.GONE
                        ivExperience.visibility = View.VISIBLE
                        return false
                    }
                })
                .fitCenter()
                .into(ivExperience)
            ivExperience.visibility = View.VISIBLE
            sbMovie.setText(experience.movieName)
            llNoSelectionPlaceholder.visibility = View.GONE
            clAddExperienceForm.visibility = View.VISIBLE
        }
    }

    private fun validateForm() {
        binding.fabPost.apply {
            if (experienceViewModel.isReadyToUpload()) {
                isEnabled = true
                alpha = 1f
            } else {
                isEnabled = false
                alpha = 0.16f
            }
        }
    }

    private fun watchExperienceUpload() =
        experienceViewModel.uploadStatus.observe(viewLifecycleOwner)
        {
            when (it) {
                is Resource.Loading -> {
                    binding.lpiUploadingExperience.visibility = View.VISIBLE
                }

                is Resource.Success -> {
                    experienceViewModel.latestExperiences.observe(viewLifecycleOwner) {
                        if (it is Resource.Success) {
                            binding.lpiUploadingExperience.visibility = View.GONE
                            findNavController().popBackStack()
                        }
                    }
                }

                is Resource.Failed -> {
                    binding.lpiUploadingExperience.visibility = View.GONE
                    Snackbar.make(
                        requireView(),
                        it.message ?: getString(R.string.something_went_wrong),
                        Snackbar.LENGTH_LONG
                    ).show()
                }
            }
        }

    private fun showImageFromFile(uri: Uri) {
        binding.apply {
            fabUploadImage.visibility = View.GONE
            fabEditImage.visibility = View.VISIBLE
            ivExperience.apply {
                visibility = View.VISIBLE
                setImageURI(uri)
            }
        }
    }

    private fun setupSearchView(
        searchAdapter: MovieSearchSuggestionsAdapter,
    ) {
        moviesViewModel.searchedMovies.observe(viewLifecycleOwner) {
            when (it) {
                is Resource.Loading -> {
                    binding.lpiMovieSearchSuggestions.visibility = View.VISIBLE
                }

                is Resource.Success -> {
                    searchAdapter.differ.submitList(it.data)
                    binding.lpiMovieSearchSuggestions.visibility = View.GONE
                }

                is Resource.Failed -> {
                    Snackbar.make(
                        requireView(),
                        it.message ?: getString(R.string.something_went_wrong),
                        Snackbar.LENGTH_LONG
                    ).show()
                }
            }
        }


        binding.apply {
            svMovie.setupWithSearchBar(sbMovie)
            rvMovieSearchSuggestions.layoutManager = LinearLayoutManager(requireContext())
            rvMovieSearchSuggestions.adapter = searchAdapter

            var searchMovieJob: Job? = null
            svMovie.editText.addTextChangedListener { editable ->
                searchMovieJob?.cancel()
                searchMovieJob = lifecycleScope.launch {
                    delay(Constants.SEARCH_MOVIES_TIME_DELAY)
                    editable.let {
                        moviesViewModel.searchMovies(editable.toString())
                    }
                }
            }

            svMovie.addTransitionListener { searchView, previousState, newState ->
                if (previousState == SearchView.TransitionState.SHOWN && newState == SearchView.TransitionState.HIDING) {
                    searchAdapter.differ.submitList(emptyList())
                }
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}