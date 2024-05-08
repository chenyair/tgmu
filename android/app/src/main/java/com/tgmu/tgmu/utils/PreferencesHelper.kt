package com.tgmu.tgmu.utils

import android.content.Context

class PreferencesHelper(context: Context) {
    private val PREFS_NAME = "tgmu_prefs"
    private val DARK_MODE = "dark_mode"
    private val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    fun setDarkMode(isDarkMode: Boolean) {
        prefs.edit().putBoolean(DARK_MODE, isDarkMode).apply()
    }

    fun isDarkMode() = prefs.getBoolean(DARK_MODE, false)
}