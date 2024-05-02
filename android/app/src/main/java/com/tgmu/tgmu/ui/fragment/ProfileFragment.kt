package com.tgmu.tgmu.ui.fragment

import android.content.Intent
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.appcompat.content.res.AppCompatResources.getDrawable
import androidx.core.widget.addTextChangedListener
import androidx.fragment.app.viewModels
import com.bumptech.glide.Glide
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.material.datepicker.MaterialDatePicker
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.google.android.material.snackbar.Snackbar
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.GoogleAuthProvider
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import com.tgmu.tgmu.R
import com.tgmu.tgmu.databinding.DialogEditProfileBinding
import com.tgmu.tgmu.databinding.FragmentProfileBinding
import com.tgmu.tgmu.domain.model.UserDetails
import com.tgmu.tgmu.ui.TgmuApplication
import com.tgmu.tgmu.ui.activities.LoginActivity
import com.tgmu.tgmu.ui.viewmodel.UsersDetailsViewModel
import com.tgmu.tgmu.utils.PreferencesHelper
import com.tgmu.tgmu.utils.Resource
import dagger.hilt.android.AndroidEntryPoint
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
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
        val format = SimpleDateFormat("dd/MM/yyyy")

        setupUserDetails(format)
        binding.apply {
            fabEditProfile.setOnClickListener {
                val userDetails =
                    (usersDetailsViewModel.currentUserDetails.value as Resource.Success).data
                usersDetailsViewModel.startUpdateUserDetailsForm(userDetails)
                setupEditProfileDialog(format)
            }
        }

        binding.apply {
            btnLogOut.setOnClickListener {
                signOut()
            }

        }
    }

    private fun setupEditProfileDialog(format: SimpleDateFormat) {
        val formData = usersDetailsViewModel.updateUserDetailsForm.value!!
        val dialogBinding = DialogEditProfileBinding.inflate(layoutInflater)
        val dialog = MaterialAlertDialogBuilder(requireContext())
            .setTitle(getString(R.string.edit_your_profile))
            .setView(dialogBinding.root)
            .show()

        dialogBinding.apply {
            tiFullName.editText!!.setText(formData.fullName)
            tiFullName.editText!!.addTextChangedListener { text ->
                usersDetailsViewModel.changeUpdateUserDetailsFormData(fullName = text.toString())
            }

            tiBirthdate.editText!!.setText(format.format(formData.birthdate))
            tiBirthdate.editText!!.addTextChangedListener { text ->
                usersDetailsViewModel.changeUpdateUserDetailsFormData(birthdate = format.parse(text.toString()))
            }

            val datePicker =
                MaterialDatePicker.Builder.datePicker()
                    .setTitleText("Select your birthdate")
                    .setSelection(MaterialDatePicker.todayInUtcMilliseconds())
                    .build()

            datePicker.addOnPositiveButtonClickListener {
                val formatter = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault())
                tiBirthdate.editText?.setText(formatter.format(Date(it)))
            }

            tiBirthdate.editText?.setOnClickListener {
                datePicker.show(childFragmentManager, "date_picker")
            }

            btnSave.setOnClickListener {
                usersDetailsViewModel.updateUserDetails()

                usersDetailsViewModel.userDetailsUpdate.observe(viewLifecycleOwner) {
                    when (it) {
                        is Resource.Loading -> {
                            lpiUpdateProfile.visibility = View.VISIBLE
                        }

                        is Resource.Success -> {
                            dialog.dismiss()
                            setupUserDetails(format)
                        }

                        is Resource.Failed -> {
                            dialog.dismiss()
                            Snackbar.make(
                                binding.root,
                                getString(R.string.update_failed),
                                Snackbar.LENGTH_LONG
                            ).show()
                            Log.e("ProfileFragment", "onViewCreated: ${it.message}")
                        }
                    }
                }
            }
            btnCancel.setOnClickListener {
                dialog.dismiss()
            }
        }
    }

    private fun setupUserDetails(format: SimpleDateFormat) {
        val userDetails = (usersDetailsViewModel.currentUserDetails.value as Resource.Success).data

        binding.apply {
            val defaultAvatar =
                generateInitialsBitmap(userDetails.fullName)
            Glide.with(this@ProfileFragment)
                .load(auth.currentUser?.photoUrl)
                .error(defaultAvatar)
                .into(ivAvatar)
            ivAvatar.bringToFront()

            tvName.text = userDetails.fullName
            tvEmail.text = userDetails.email

            tvBirthdate.text =
                format.format(userDetails.birthdate)

            val prefsHelper = PreferencesHelper(requireContext())
            switchDarkMode.isChecked = prefsHelper.isDarkMode()
            switchDarkMode.thumbIconDrawable = if (prefsHelper.isDarkMode()) {
                getDrawable(requireContext(), R.drawable.ic_done)
            } else {
                getDrawable(requireContext(), R.drawable.ic_close)
            }

            switchDarkMode.setOnCheckedChangeListener { _, isChecked ->
                prefsHelper.setDarkMode(isChecked)
                (requireActivity().application as TgmuApplication).updateDarkMode()
                switchDarkMode.thumbIconDrawable = if (isChecked) {
                    getDrawable(requireContext(), R.drawable.ic_done)
                } else {
                    getDrawable(requireContext(), R.drawable.ic_close)
                }
            }
        }
    }

    private fun generateInitialsBitmap(fullName: String): Bitmap {
        val initials = fullName.split(" ").map { it.first() }.joinToString("").uppercase()
        val bitmap = Bitmap.createBitmap(100, 100, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bitmap)
        val paint = Paint().apply {
            color = Color.WHITE
            textSize = 40f
            textAlign = Paint.Align.CENTER
        }
        canvas.drawColor(resources.getColor(R.color.md_theme_tertiaryContainer, null))
        canvas.drawText(
            if (initials.length <= 2) initials else "${initials.first()}${initials.last()}",
            bitmap.width / 2f,
            bitmap.height / 2f - (paint.descent() + paint.ascent()) / 2,
            paint
        )
        return bitmap
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
            GoogleSignIn.getClient(requireContext(), GoogleSignInOptions.DEFAULT_SIGN_IN)
                .signOut()
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