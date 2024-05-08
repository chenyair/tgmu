package com.tgmu.tgmu.ui

import android.app.Application
import androidx.appcompat.app.AppCompatDelegate
import com.google.firebase.FirebaseApp
import com.tgmu.tgmu.R
import com.tgmu.tgmu.ui.viewmodel.UsersDetailsViewModel
import com.tgmu.tgmu.utils.PreferencesHelper
import dagger.hilt.android.HiltAndroidApp
import javax.inject.Inject

@HiltAndroidApp
class TgmuApplication() : Application() {
    @Inject
    lateinit var usersDetailsViewModel: UsersDetailsViewModel

    override fun onCreate() {
        super.onCreate()
        updateDarkMode()
    }

    fun updateDarkMode() {
        val perfsHelper = PreferencesHelper(this)
        if (perfsHelper.isDarkMode()) {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES)
        } else {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO)
        }
    }
}