@echo off
for %%F in ("*.jpg") do (
    ffmpeg -i "%%F" "%%~nF.webp"
)
pause