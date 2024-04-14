package com.tgmu.tgmu.ui

import android.app.Application
import com.tgmu.tgmu.ui.viewmodel.UsersDetailsViewModel
import dagger.hilt.android.HiltAndroidApp
import javax.inject.Inject

@HiltAndroidApp
class TgmuApplication() : Application() {
    @Inject
    lateinit var usersDetailsViewModel: UsersDetailsViewModel

    override fun onCreate() {
        super.onCreate()
    }
}