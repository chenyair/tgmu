package com.tgmu.tgmu.ui.fragment

import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.viewModels
import androidx.recyclerview.widget.GridLayoutManager
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
        val experienceAdapter = CompactExperienceAdapter()

        setupExperiencesList(experienceAdapter)
    }

    private fun setupExperiencesList(experienceAdapter: CompactExperienceAdapter) {
        experienceViewModel.latestExperiences.observe(viewLifecycleOwner) {
            // switch case to handle different states of the Resource
            when (it) {
                is Resource.Loading -> {
                    binding.tvLoadingExperiences.apply {
                        text = "loading experiences..."
                        visibility = View.VISIBLE
                    }
                }

                is Resource.Success -> {
                    binding.tvLoadingExperiences.visibility = View.GONE
                    experienceAdapter.differ.submitList(it.data)
                }

                is Resource.Failed -> {
                    binding.tvLoadingExperiences.apply {
                        text = "failed..."
                        visibility = View.VISIBLE
                    }
                }
            }

        }

        binding.apply {
            rvExperienceList.apply {
                adapter = experienceAdapter
                layoutManager = GridLayoutManager(requireContext(), 2)
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}