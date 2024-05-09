package com.tgmu.tgmu.ui.activities

import android.app.AlertDialog
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.graphics.drawable.ColorDrawable
import android.os.Bundle
import android.util.Log
import android.view.MotionEvent
import android.view.inputmethod.InputMethodManager
import android.widget.EditText
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.datepicker.MaterialDatePicker
import com.google.android.material.snackbar.Snackbar
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import com.tgmu.tgmu.R
import com.tgmu.tgmu.databinding.ActivityRegisterBinding
import com.tgmu.tgmu.ui.viewmodel.UsersDetailsViewModel
import com.tgmu.tgmu.utils.Resource
import dagger.hilt.android.AndroidEntryPoint
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import javax.inject.Inject

@AndroidEntryPoint
class RegisterActivity : AppCompatActivity() {
    private lateinit var binding: ActivityRegisterBinding
    private lateinit var auth: FirebaseAuth

    @Inject
    lateinit var usersDetailsViewModel: UsersDetailsViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)

        auth = Firebase.auth

        binding.apply {
            main.setOnTouchListener { _, event ->
                if (event.action == MotionEvent.ACTION_DOWN) {
                    val view = currentFocus
                    if (view is EditText) {
                        val imm =
                            getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
                        imm.hideSoftInputFromWindow(view.windowToken, 0)
                        view.clearFocus()
                    }
                }

                false
            }

            llBack.setOnClickListener {
                finish()
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
                datePicker.show(supportFragmentManager, "date_picker")
            }

            btnRegister.setOnClickListener {
                registerWithEmailAndPassword(
                    tiEmail.editText?.text.toString(),
                    tiPassword.editText?.text.toString()
                )
            }
        }

        val builder = AlertDialog.Builder(this@RegisterActivity)
        builder.setView(layoutInflater.inflate(R.layout.loading_modal, null))
        builder.setCancelable(false)
        val dialog = builder.create()
        dialog.window?.setBackgroundDrawable(ColorDrawable(Color.TRANSPARENT)) // Set the background to transparent

        usersDetailsViewModel.currentUserDetails.observe(this) {
            when (it) {
                is Resource.Loading -> {
                    dialog.show()
                }

                is Resource.Success -> {
                    dialog.dismiss()
                    openMainActivity()
                }

                is Resource.Failed -> {
                    dialog.dismiss()
                    Snackbar.make(
                        binding.root, getString(R.string.register_failed), Snackbar.LENGTH_LONG
                    ).show()
                }
            }
        }
    }

    private fun openMainActivity() {
        val intent = Intent(this, MainActivity::class.java).also {
            it.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            startActivity(it)
        }
    }

    private fun registerWithEmailAndPassword(email: String, password: String) {
        auth.createUserWithEmailAndPassword(email, password)
            .addOnCompleteListener(this) { task ->
                if (task.isSuccessful) {
                    val email = auth.currentUser?.email!!
                    val fullName = binding.tiFullName.editText?.text.toString()
                    val birthdate = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault()).parse(
                        binding.tiBirthdate.editText?.text.toString()
                    )!!
                    val authUid = auth.currentUser?.uid!!

                    usersDetailsViewModel.createAndUpdateUserDetails(
                        email,
                        fullName,
                        birthdate,
                        authUid,
                        ""
                    )
                } else {
                    val exception = task.exception
                    Log.e("RegisterActivity", "Failed to register", exception)
                    Snackbar.make(
                        binding.root, getString(R.string.register_failed), Snackbar.LENGTH_LONG
                    ).show()
                }
            }
    }
}