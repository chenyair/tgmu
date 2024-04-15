package com.tgmu.tgmu.ui.fragment

import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.viewModels
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.android.material.snackbar.Snackbar
import com.google.firebase.Firebase
import com.google.firebase.auth.auth
import com.tgmu.tgmu.R
import com.tgmu.tgmu.databinding.FragmentDiscoverBinding
import com.tgmu.tgmu.databinding.FragmentExperiencesBinding
import com.tgmu.tgmu.ui.adapters.CompactExperienceAdapter
import com.tgmu.tgmu.ui.viewmodel.ExperienceViewModel
import com.tgmu.tgmu.utils.Resource
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class ExperiencesFragment : Fragment(R.layout.fragment_experiences) {
    private var _binding: FragmentExperiencesBinding? = null
    private val binding get() = _binding!!
    private val experienceViewModel: ExperienceViewModel by viewModels()

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
        val experienceAdapter = CompactExperienceAdapter() {
            experienceViewModel.toggleLiked(it, Firebase.auth.currentUser!!.uid)
        }

        setupExperiencesList(experienceAdapter)
    }

    private fun setupExperiencesList(experienceAdapter: CompactExperienceAdapter) {
        experienceViewModel.latestExperiences.observe(viewLifecycleOwner) {
            when (it) {
                is Resource.Loading -> {
                    binding.cpiExperienceList.visibility = View.VISIBLE
                }

                is Resource.Success -> {
                    experienceAdapter.differ.submitList(it.data)
                    binding.cpiExperienceList.visibility = View.GONE
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
            rvExperienceList.apply {
                adapter = experienceAdapter
                layoutManager = LinearLayoutManager(requireContext())
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}