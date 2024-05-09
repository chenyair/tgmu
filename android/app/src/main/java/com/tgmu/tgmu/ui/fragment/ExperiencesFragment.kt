package com.tgmu.tgmu.ui.fragment

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.core.widget.addTextChangedListener
import androidx.fragment.app.activityViewModels
import androidx.fragment.app.viewModels
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.android.material.search.SearchView
import com.google.android.material.snackbar.Snackbar
import com.google.firebase.Firebase
import com.google.firebase.auth.auth
import com.tgmu.tgmu.R
import com.tgmu.tgmu.databinding.FragmentExperiencesBinding
import com.tgmu.tgmu.domain.model.Experience
import com.tgmu.tgmu.ui.adapters.CompactExperienceAdapter
import com.tgmu.tgmu.ui.adapters.MovieSearchSuggestionsAdapter
import com.tgmu.tgmu.ui.viewmodel.ExperienceViewModel
import com.tgmu.tgmu.ui.viewmodel.MoviesViewModel
import com.tgmu.tgmu.ui.viewmodel.UsersDetailsViewModel
import com.tgmu.tgmu.utils.Constants
import com.tgmu.tgmu.utils.Resource
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import javax.inject.Inject
import kotlin.math.exp

@AndroidEntryPoint
class ExperiencesFragment : Fragment(R.layout.fragment_experiences) {
    private var _binding: FragmentExperiencesBinding? = null
    private val binding get() = _binding!!
    private val experienceViewModel: ExperienceViewModel by activityViewModels()
    private val moviesViewModel: MoviesViewModel by activityViewModels()

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

        binding.btnAddExperience.setOnClickListener {
            val action =
                ExperiencesFragmentDirections.experienceViewToExperienceForm()
            findNavController().navigate(action)
        }

        binding.btnSwitchExperienceView.setOnClickListener {
            experienceViewModel.toggleFilterExperiences()
        }

        val searchAdapter = MovieSearchSuggestionsAdapter {
            binding.sbMovie.setText(it.title)
            binding.svMovie.hide()
            experienceViewModel.getExperiencesByMovieId(it.id)
        }

        val experienceAdapter = CompactExperienceAdapter(
            onCardClicked = {
                val action =
                    ExperiencesFragmentDirections.actionExperienceViewToExpandedExperience(it)
                findNavController().navigate(action)
            }, onLikeClicked = {
                experienceViewModel.toggleLiked(it, Firebase.auth.currentUser!!.uid)
            }, onEditClicked = {
                val action =
                    ExperiencesFragmentDirections.experienceViewToExperienceForm(it)
                findNavController().navigate(action)
            })

        setupExperiencesList(experienceAdapter)
        setupSearchView(searchAdapter)
    }

    private fun setupExperiencesList(experienceAdapter: CompactExperienceAdapter) {
        experienceViewModel.isExperiencesFiltered.observe(viewLifecycleOwner) { filterStatus ->
            experienceViewModel.latestExperiences.observe(viewLifecycleOwner) {
                when (it) {
                    is Resource.Loading -> {
                        binding.cpiExperienceList.visibility = View.VISIBLE
                    }

                    is Resource.Success -> {
                        var experiences: List<Experience>
                        if (filterStatus) {
                            experiences = it.data.filter { experience -> experience.userId == Firebase.auth.currentUser!!.uid }
                            binding.btnSwitchExperienceView.text = getString(R.string.show_all_experiences)
                        } else {
                            experiences = it.data
                            binding.btnSwitchExperienceView.text = getString(R.string.show_only_my_experiences)
                        }

                        experienceAdapter.differ.submitList(experiences) {
                            binding.cpiExperienceList.visibility = View.GONE
                            binding.rvExperienceList.layoutManager!!.scrollToPosition(0)
                            experienceViewModel.uploadStatus.observe(viewLifecycleOwner) { status ->
                                if (status is Resource.Success)
                                    binding.rvExperienceList.layoutManager!!.scrollToPosition(0)
                            }
                        }
                        if (experiences.isEmpty()) {
                            Snackbar.make(
                                requireView(),
                                getString(
                                    R.string.no_experiences_for_movie,
                                    binding.sbMovie.text.toString()
                                ),
                                Snackbar.LENGTH_LONG
                            ).show()
                        }
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

            tvRecentExperiencesSuggestion.text = getString(R.string.show_recent_experiences)
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