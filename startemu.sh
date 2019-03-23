#! /bin/bash
$ANDROID_HOME/emulator/emulator.exe -netdelay none -netspeed full -avd $(cat .android_emu_name) &
