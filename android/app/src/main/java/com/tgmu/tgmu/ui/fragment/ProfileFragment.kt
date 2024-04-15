package com.tgmu.tgmu.ui.fragment

import android.content.Intent
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.viewModels
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.GoogleAuthProvider
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import com.tgmu.tgmu.databinding.FragmentProfileBinding
import com.tgmu.tgmu.ui.activities.LoginActivity
import com.tgmu.tgmu.ui.viewmodel.UsersDetailsViewModel
import com.tgmu.tgmu.utils.Resource
import dagger.hilt.android.AndroidEntryPoint
import javax.inject.Inject

@AndroidEntryPoint
class ProfileFragment : Fragment() {
    private var _binding: FragmentProfileBinding? = null
    private val binding get() = _binding!!
    private lateinit var auth: FirebaseAuth

    @Inject
    lateinit var usersDetailsViewModel: UsersDetailsViewModel


    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentProfileBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        auth = Firebase.auth
        binding.apply {
            btnLogOut.setOnClickListener {
                signOut()
            }

            tvDisplayName.text =
                (usersDetailsViewModel.currentUserDetails.value as Resource.Success).data.fullName
        }
    }


    private fun isUserLoggedInWithGoogle(): Boolean {
        val user = auth.currentUser
        user?.let {
            for (userInfo in it.providerData) {
                if (userInfo.providerId == GoogleAuthProvider.PROVIDER_ID) {
                    return true
                }
            }
        }
        return false
    }

    private fun signOut() {
        if (isUserLoggedInWithGoogle()) {
            GoogleSignIn.getClient(requireContext(), GoogleSignInOptions.DEFAULT_SIGN_IN).signOut()
        }

        auth.signOut()
        usersDetailsViewModel.logOut()
        Intent(requireContext(), LoginActivity::class.java).also {
            it.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            startActivity(it)
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}