package com.tgmu.tgmu.ui

import android.app.Application
import dagger.hilt.android.HiltAndroidApp

@HiltAndroidApp
class TgmuApplication(): Application() {
    override fun onCreate() {
        super.onCreate()
    }
}