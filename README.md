# nano-keybindings

This is a VS Code extension that lets you use keybindings from GNU nano.

Note that this is a personal project used by me. This extension may be buggy. In case it destroys your project or clipboard contents accidentally, please do submit a bug report, but I'm not liable for any of the damage caused. Use at your own risk.

## Features

This extension gives you nano-style cutting and pasting:
- `ctrl+k` cuts.
  - If you have text selected, this will act as your traditional cutting (`ctrl+x` in most editorss).
  - Otherwise, if you have "cut to end" enabled, this will cut everything from your current cursor to the end of the line, excluding the newline.
  - If you have "cut to end" disabled, this will cut the entire line your cursor is on. If you use `ctrl+k` multiple times, it will append each line into your clipboard.
- `ctrl+u` pastes.
- `alt+u` toggles "cut to end" mode (default: disabled)

It also adds the following keybindings for default actions:
- `ctrl+w` for searching
- `ctrl+\` for replace
- `alt+w` for next match
- `alt+q` for previous match
- `ctrl+shift+_` for going to a line
- `ctrl+x` for closing a file

## To-do

The feature I needed the most was cut and paste, so I haven't implemented any of the other features yet. If you would like to see a feature added, please let me know! (or better yet, make a PR).

## Release Notes

### 0.1.1

Bugfix: typos in README, `ctrl+x` closes entire editor instead of file, and removed debug output from extension.

### 0.1.0

Initial release, with cut and paste.
