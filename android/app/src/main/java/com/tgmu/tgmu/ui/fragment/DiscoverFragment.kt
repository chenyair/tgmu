package com.tgmu.tgmu.ui.fragment

import android.os.Bundle
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
import com.tgmu.tgmu.R
import com.tgmu.tgmu.databinding.FragmentDiscoverBinding
import com.tgmu.tgmu.ui.adapters.MovieSearchSuggestionsAdapter
import com.tgmu.tgmu.ui.adapters.PopularMoviesAdapter
import com.tgmu.tgmu.ui.viewmodel.MoviesViewModel
import com.tgmu.tgmu.utils.Constants.Companion.SEARCH_MOVIES_TIME_DELAY
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@AndroidEntryPoint
class DiscoverFragment : Fragment() {
    private var _binding: FragmentDiscoverBinding? = null
    private val binding get() = _binding!!
    private val moviesViewModel: MoviesViewModel by viewModels()


    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentDiscoverBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val popularMoviesAdapter = PopularMoviesAdapter()
        val movieSearchSuggestionAdapter = MovieSearchSuggestionsAdapter()

        binding.apply {
            rvPopularMovies.layoutManager = GridLayoutManager(requireContext(), 2)
            rvPopularMovies.adapter = popularMoviesAdapter
            svMovie.setupWithSearchBar(sbMovie)

            // Setup search movie suggestion autocomplete
            rvMovieSearchSuggestions.layoutManager = LinearLayoutManager(requireContext())
            rvMovieSearchSuggestions.adapter = movieSearchSuggestionAdapter

            var searchMovieJob: Job? = null
            svMovie.editText.addTextChangedListener { editable ->
                searchMovieJob?.cancel()
                searchMovieJob = lifecycleScope.launch {
                    delay(SEARCH_MOVIES_TIME_DELAY)
                    editable.let {
                        moviesViewModel.searchMovies(editable.toString())
                    }
                }

            }

            svMovie.addTransitionListener{ searchView, previousState, newState ->
                if (previousState == SearchView.TransitionState.SHOWN && newState == SearchView.TransitionState.HIDING) {
                    movieSearchSuggestionAdapter.differ.submitList(emptyList())
                }
            }
        }

        moviesViewModel.popularMovies.observe(viewLifecycleOwner) {
            popularMoviesAdapter.differ.submitList(it)
        }

        moviesViewModel.searchedMovies.observe(viewLifecycleOwner) {
            movieSearchSuggestionAdapter.differ.submitList(it)
        }

    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}