package com.tgmu.tgmu.ui.fragment

import android.content.Intent
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.GoogleAuthProvider
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import com.tgmu.tgmu.databinding.FragmentProfileBinding
import com.tgmu.tgmu.ui.activities.LoginActivity
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class ProfileFragment : Fragment() {
    private var _binding: FragmentProfileBinding? = null
    private val binding get() = _binding!!
    private lateinit var auth: FirebaseAuth

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

            tvDisplayName.text = auth.currentUser!!.displayName
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