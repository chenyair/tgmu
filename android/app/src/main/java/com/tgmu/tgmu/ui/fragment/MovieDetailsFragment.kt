package com.tgmu.tgmu.ui.fragment

import android.os.Bundle
import android.transition.TransitionInflater
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import com.bumptech.glide.Glide
import com.tgmu.tgmu.R
import com.tgmu.tgmu.databinding.FragmentMovieDetailsBinding
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MovieDetailsFragment : Fragment() {
    private var _binding: FragmentMovieDetailsBinding? = null
    private val binding get() = _binding!!
    private val movieDetailsArgs: MovieDetailsFragmentArgs by navArgs()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        sharedElementEnterTransition = TransitionInflater.from(context)
            .inflateTransition(android.R.transition.move)
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentMovieDetailsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val movie = movieDetailsArgs.movie
        val transitionName =
            "${getString(R.string.transition_name_movie_poster)}${movie.id}"

        binding.apply {
            tvMovieTitle.text = movie.title
            Glide
                .with(requireContext())
                .load("https://image.tmdb.org/t/p/original/${movie.poster_path ?: ""}")
                .centerCrop()
                .into(ivMoviePoster)

            cwMoviePoster.transitionName = transitionName

            cvBack.setOnClickListener {
                findNavController().popBackStack()
            }
        }
    }
}