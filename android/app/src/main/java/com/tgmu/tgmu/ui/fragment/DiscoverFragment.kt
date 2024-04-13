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
import com.tgmu.tgmu.ui.adapters.MoviePostersAdapter
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
        val postersAdapter = MoviePostersAdapter()
        val searchAdapter = MovieSearchSuggestionsAdapter()

        setupPostersList(postersAdapter)
        setupSearchView(searchAdapter)
    }

    private fun setupPostersList(postersAdapter: MoviePostersAdapter) {
        moviesViewModel.posterMovies.observe(viewLifecycleOwner) {
            postersAdapter.differ.submitList(it)
        }

        binding.apply {
            rvPosterMovies.layoutManager = GridLayoutManager(requireContext(), 2)
            rvPosterMovies.adapter = postersAdapter
        }
    }

    private fun setupSearchView(
        searchAdapter: MovieSearchSuggestionsAdapter,
    ) {

        moviesViewModel.searchedMovies.observe(viewLifecycleOwner) {
            searchAdapter.differ.submitList(it)
        }

        binding.apply {
            svMovie.setupWithSearchBar(sbMovie)
            rvMovieSearchSuggestions.layoutManager = LinearLayoutManager(requireContext())
            rvMovieSearchSuggestions.adapter = searchAdapter

            clHeader.setOnClickListener {
                svMovie.hide()
                moviesViewModel.updatePosters(svMovie.text.toString())
                sbMovie.setText(svMovie.text.toString())
            }

            var searchMovieJob: Job? = null
            svMovie.editText.addTextChangedListener { editable ->
                tvPosterSuggestionQuery.text = if (editable.toString()
                        .isEmpty()
                ) {
                    getString(R.string.show_popular_movies)
                } else {
                    getString(
                        R.string.show_posters_containing,
                        svMovie.text.toString()
                    )
                }
                searchMovieJob?.cancel()
                searchMovieJob = lifecycleScope.launch {
                    delay(SEARCH_MOVIES_TIME_DELAY)
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