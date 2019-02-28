# Note-Fe App
React-native front-end app for Note-Fe.

### Development FAQs
- Running `storybook:dev` does not work when running on real android device.
  Storybook web port simply needs to be forwarded in addition to the metro bundler
  port that `react-native run-android` automatically forwards.
  So run `adb -s <device-id> reverse tcp:7007 tcp:7007` after connecting device.