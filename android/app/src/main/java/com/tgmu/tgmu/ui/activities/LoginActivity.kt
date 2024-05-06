package com.tgmu.tgmu.ui.activities

import android.app.Activity
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
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException
import com.google.android.material.snackbar.Snackbar
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.GoogleAuthProvider
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import com.tgmu.tgmu.BuildConfig
import com.tgmu.tgmu.R
import com.tgmu.tgmu.databinding.ActivityLoginBinding
import com.tgmu.tgmu.ui.viewmodel.UsersDetailsViewModel
import com.tgmu.tgmu.utils.Resource
import dagger.hilt.android.AndroidEntryPoint
import java.util.Date
import javax.inject.Inject

@AndroidEntryPoint
class LoginActivity : AppCompatActivity() {
    private lateinit var binding: ActivityLoginBinding
    private lateinit var auth: FirebaseAuth

    @Inject
    lateinit var usersDetailsViewModel: UsersDetailsViewModel
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Redirect to MainActivity when user is logged
        auth = Firebase.auth
        if (auth.currentUser != null) {
            usersDetailsViewModel.getUserDetails(auth.currentUser?.email!!)
        }

        val builder = AlertDialog.Builder(this@LoginActivity)
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
                        binding.root,
                        "Sign in failed. There might be a communication error",
                        Snackbar.LENGTH_SHORT
                    ).show()
                }
            }
        }


        binding.apply {
            // Enable clicking outside to dismiss keyboard
            clLogin.setOnTouchListener { _, event ->
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

            // Setup sign in with username and password
            btnSignIn.setOnClickListener {
                val email = tiEmail.editText?.text.toString()
                val password = tiPassword.editText?.text.toString()

                if (isEmailAndPasswordValid(email, password)) {
                    signInWithUsernameAndPassword(email, password)
                }
            }

            btnRegister.setOnClickListener {
                val intent = Intent(this@LoginActivity, RegisterActivity::class.java).also {
                    startActivity(it)
                }
            }
        }

        setupGoogleSignIn()
    }


    private fun openMainActivity() {
        val intent = Intent(this, MainActivity::class.java).also {
            it.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            startActivity(it)
        }
    }

    private fun isEmailAndPasswordValid(email: String, password: String): Boolean {
        var isValid = true

        // Remove previous validations
        binding.tiEmail.error = null
        binding.tiPassword.error = null

        // Validate email
        if (email.isEmpty()) {
            binding.tiEmail.error = getString(R.string.required_email)
            isValid = false
        } else {
            val emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\$"
            if (!email.matches(emailRegex.toRegex())) {
                binding.tiEmail.error = getString(R.string.invalid_email)
                isValid = false
            }
        }

        // Validate password
        if (password.isEmpty()) {
            binding.tiPassword.error = getString(R.string.required_password)
            isValid = false
        } else if (password.length < 8) {
            binding.tiPassword.error = getString(R.string.invalid_password_length)
            isValid = false
        }

        return isValid
    }

    private fun signInWithUsernameAndPassword(username: String, password: String) {
        usersDetailsViewModel.showLoading()
        auth.signInWithEmailAndPassword(username, password)
            .addOnCompleteListener(this) { task ->
                if (task.isSuccessful) {
                    usersDetailsViewModel.getUserDetails(auth.currentUser?.email!!)
                } else {
                    Log.e("LoginActivity", "signInWithUsernameAndPassword:failure", task.exception)
                    Snackbar.make(
                        binding.root,
                        getString(R.string.email_password_sign_in_failed),
                        Snackbar.LENGTH_SHORT
                    ).show()
                }
            }
    }

    private fun setupGoogleSignIn() {
        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestIdToken(BuildConfig.GOOGLE_WEB_CLIENT_ID)
            .requestEmail()
            .build()


        val googleSignInClient = GoogleSignIn.getClient(this, gso)

        var googleSignInActivityLauncher =
            registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
                if (result.resultCode == Activity.RESULT_OK) {
                    val data: Intent? = result.data
                    val task = GoogleSignIn.getSignedInAccountFromIntent(data)

                    try {
                        // Google Sign In was successful, authenticate with Firebase
                        val account = task.getResult(ApiException::class.java)

                        val credential = GoogleAuthProvider.getCredential(account.idToken, null)

                        auth.signInWithCredential(credential)
                            .addOnCompleteListener(this) { task ->
                                if (task.isSuccessful) {
                                    Log.d("LoginActivity", "signInWithCredential:success")
                                    val isNewUser =
                                        task.result.additionalUserInfo?.isNewUser ?: false
                                    if (isNewUser) {
                                        usersDetailsViewModel.createAndUpdateUserDetails(
                                            auth.currentUser?.email!!,
                                            auth.currentUser?.displayName!!,
                                            Date(),
                                            auth.currentUser?.uid!!
                                        )
                                    } else {
                                        usersDetailsViewModel.getUserDetails(auth.currentUser?.email!!)
                                    }
                                } else {
                                    Log.e(
                                        "LoginActivity",
                                        "signInWithCredential:failure",
                                        task.exception
                                    )
                                    // If sign in fails, display a message to the user.
                                    Snackbar.make(
                                        binding.root,
                                        getString(R.string.google_sign_in_failed),
                                        Snackbar.LENGTH_SHORT
                                    ).show()
                                }
                            }

                    } catch (e: ApiException) {
                        // Google Sign In failed, update UI appropriately
                        Log.e("LoginActivity", "Google sign in failed", e)
                    }
                }
            }

        binding.apply {
            ivGoogleSignIn.setOnClickListener {
                val signInIntent = googleSignInClient.signInIntent
                googleSignInActivityLauncher.launch(signInIntent)
            }
        }
    }
}