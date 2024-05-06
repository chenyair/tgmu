package com.tgmu.tgmu.ui.fragment

import android.os.Bundle
import android.transition.TransitionInflater
import android.util.Log
import android.view.Gravity
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.MenuItem
import android.view.View
import android.view.ViewGroup
import android.widget.PopupMenu
import androidx.annotation.MenuRes
import androidx.fragment.app.activityViewModels
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import com.bumptech.glide.Glide
import com.google.android.material.chip.Chip
import com.google.android.material.snackbar.Snackbar
import com.tgmu.tgmu.R
import com.tgmu.tgmu.databinding.FragmentMovieDetailsBinding
import com.tgmu.tgmu.ui.viewmodel.MoviesViewModel
import com.tgmu.tgmu.utils.Constants
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MovieDetailsFragment : Fragment() {
    private var _binding: FragmentMovieDetailsBinding? = null
    private val binding get() = _binding!!
    private val movieDetailsArgs: MovieDetailsFragmentArgs by navArgs()
    private val moviesViewModel: MoviesViewModel by activityViewModels()


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
        moviesViewModel.selectMovie(movie)

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

            tvMovieOverview.text = movie.overview
            movie.genre_ids.map { genreId ->
                val genre = Constants.GENRE_MAP[genreId] ?: ""
                Chip(view.context).apply {
                    text = genre
                    isCheckable = false
                    isSelected = true
                }
            }.forEach { chip ->
                cgGenres.addView(chip)
            }

            cvMore.setOnClickListener {
                showMoreOptionsMenu(it, R.menu.movie_details_actions)
            }
        }
    }

    private fun showMoreOptionsMenu(v: View, @MenuRes menuRes: Int) {
        val popupMenu = PopupMenu(requireContext(), v)
        popupMenu.menuInflater.inflate(menuRes, popupMenu.menu)
        popupMenu.gravity = Gravity.END

        val movie = moviesViewModel.selectedMovie.value ?: return

        if (!movie.is_favorite) {
            popupMenu.menu.findItem(R.id.markAsFavorite).setIcon(R.drawable.ic_star_outlined)
        } else {
            val icon = resources.getDrawable(R.drawable.ic_star_filled, null)
            icon.setTint(resources.getColor(R.color.md_theme_tertiary, null))
            popupMenu.menu.findItem(R.id.markAsFavorite).setIcon(icon)
        }

        popupMenu.setOnMenuItemClickListener { menuItem: MenuItem ->
            when (menuItem.itemId) {
                R.id.markAsFavorite -> {
                    moviesViewModel.toggleFavorite(movie)
                    Snackbar.make(
                        binding.root,
                        getString(if (movie.is_favorite) R.string.movie_removed_from_favorites else R.string.movie_marked_as_favorite),
                        Snackbar.LENGTH_LONG
                    ).show()
                    true
                }

                R.id.showExperiences -> {
                    // Handle show experiences action
                    true
                }

                else -> false
            }
        }

        try {
            val popup = PopupMenu::class.java.getDeclaredField("mPopup")
            popup.isAccessible = true
            val menu = popup.get(popupMenu)
            menu.javaClass
                .getDeclaredMethod("setForceShowIcon", Boolean::class.java)
                .invoke(menu, true)
        } catch (e: Exception) {
            Log.e("MovieDetailsFragment", "Error showing menu icons", e)
        } finally {
            popupMenu.show()
        }
    }
}