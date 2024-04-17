package com.tgmu.tgmu.ui.fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import com.google.firebase.Firebase
import com.google.firebase.auth.auth
import com.tgmu.tgmu.databinding.FragmentAddExperienceBinding
import com.tgmu.tgmu.databinding.FragmentExperiencesBinding
import com.tgmu.tgmu.ui.adapters.CompactExperienceAdapter
import com.tgmu.tgmu.ui.adapters.MovieSearchSuggestionsAdapter
import com.tgmu.tgmu.ui.viewmodel.ExperienceViewModel
import com.tgmu.tgmu.ui.viewmodel.MoviesViewModel
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class AddExperienceFragment : Fragment() {
    private var _binding: FragmentAddExperienceBinding? = null
    private val binding get() = _binding!!
    private val experienceViewModel: ExperienceViewModel by viewModels()
    private val moviesViewModel: MoviesViewModel by viewModels()


    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentAddExperienceBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Set listener on back button
        val searchAdapter = MovieSearchSuggestionsAdapter {
            // Implement function that uses the selected movie as the experience movie
        }

        val experienceAdapter = CompactExperienceAdapter() {
            experienceViewModel.toggleLiked(it, Firebase.auth.currentUser!!.uid)
        }

//        setupSearchView(searchAdapter)
    }
}