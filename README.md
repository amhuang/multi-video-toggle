# HTML Multi-Video Viewing

This UI allows simultaneous video viewing of 10 videos of the same length simultaneously. Scrubbing and playing/pausing occurs syncronously through a single progress bar. The height at which the video was taken is displayed and adjusts based off of where the video is.

NOTE: The browser, the resolutoin of videos, and your computer graphics card can handle will affect the operation of this UI. While viewing 10 videos at the same time, the videos should be 480p max. 4K video can be viewed when switching to full screen. 

Height and time data downloaded from the operation UI should be put in the main directory with `index.html` and should be named `height.json`. Videos should be stored in the folder videos and named in the following format: `video<number>-<resolution.MP4`. For example `video1-480.MP4` should be the leftmost video in 480p. These videos should be the same length, but if they aren't, the video duration will be taken from video1.

## In the works:

- Full screen capability in 4K via swapping sources. Maintaining timestamp from full screen session when returning to full view.
- Real time editing of frames from the video
