// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri_plugin_window_state::{AppHandleExt, StateFlags};

fn main() {
    app_lib::run();
}
