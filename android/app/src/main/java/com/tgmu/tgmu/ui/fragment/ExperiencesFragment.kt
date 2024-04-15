package com.tgmu.tgmu.ui.fragment

import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.core.widget.addTextChangedListener
import androidx.fragment.app.viewModels
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.android.material.search.SearchView
import com.google.android.material.snackbar.Snackbar
import com.google.firebase.Firebase
import com.google.firebase.auth.auth
import com.tgmu.tgmu.R
import com.tgmu.tgmu.databinding.FragmentDiscoverBinding
import com.tgmu.tgmu.databinding.FragmentExperiencesBinding
import com.tgmu.tgmu.ui.adapters.CompactExperienceAdapter
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
class ExperiencesFragment : Fragment(R.layout.fragment_experiences) {
    private var _binding: FragmentExperiencesBinding? = null
    private val binding get() = _binding!!
    private val experienceViewModel: ExperienceViewModel by viewModels()
    private val moviesViewModel: MoviesViewModel by viewModels()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentExperiencesBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val searchAdapter = MovieSearchSuggestionsAdapter {
            binding.sbMovie.setText(it.title)
            binding.svMovie.hide()
            experienceViewModel.getExperiencesByMovieId(it.id)
        }

        val experienceAdapter = CompactExperienceAdapter() {
            experienceViewModel.toggleLiked(it, Firebase.auth.currentUser!!.uid)
        }

        setupExperiencesList(experienceAdapter)
        setupSearchView(searchAdapter)
    }

    private fun setupExperiencesList(experienceAdapter: CompactExperienceAdapter) {
        experienceViewModel.latestExperiences.observe(viewLifecycleOwner) {
            when (it) {
                is Resource.Loading -> {
                    binding.cpiExperienceList.visibility = View.VISIBLE
                }

                is Resource.Success -> {
                    experienceAdapter.differ.submitList(it.data)
                    if (it.data.isEmpty()) {
                        Snackbar.make(
                            requireView(),
                            getString(R.string.no_experiences_for_movie, binding.sbMovie.text.toString()),
                            Snackbar.LENGTH_LONG
                        ).show()
                    }
                    binding.cpiExperienceList.visibility = View.GONE
                }

                is Resource.Failed -> {
                    binding.cpiExperienceList.visibility = View.GONE
                    Snackbar.make(
                        requireView(),
                        it.message ?: getString(R.string.something_went_wrong),
                        Snackbar.LENGTH_LONG
                    ).show()
                }
            }
        }

        binding.apply {
            rvExperienceList.apply {
                adapter = experienceAdapter
                layoutManager = LinearLayoutManager(requireContext())
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

            clHeader.setOnClickListener {
                svMovie.hide()
                experienceViewModel.getLatestExperiences()
                sbMovie.setText("")
            }

            var searchMovieJob: Job? = null
            svMovie.editText.addTextChangedListener { editable ->
                tvRecentExperiencesSuggestion.text = getString(R.string.show_recent_experiences)
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