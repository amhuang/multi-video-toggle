/*
VIDEO SETTING SLIDERS

Functions that change the brightness/contrast of MJPG streams
and hide/reveal and reset the sliders when the settings button is
clicked.
*/

var player = function() {

    let DOM = {};
    let whichVid,
        duration,   // in sec
        skipTo,
        currTime,
        source,
        height = JSON.parse(h),
        initHeightTime = height[0][1],
        maxedVid;   // which video is fullscreen (starting at 1)

    /* ----- INITIALIZING FUNCTIONS ----- */

    function cache() {

        // item(0) is fullscreen video. No source connected at first
        // item(1) and subsequent are smaller videos while all are visible
        DOM.vid = document.querySelectorAll("video");

        // container for all small videos
        DOM.allVidWindow = $('#all-videos');
        // container for fullscreen video
        DOM.fullVidWindow = $('#full-video');

        // Buttons
        DOM.icons = $('.playback-icons use');
        DOM.play = $('#play');
        DOM.cameras = $('.nav-container button');
        DOM.maximize = $('.fullscreen');

        DOM.timeElapsed = $('#time-elapsed');
        DOM.duration = $('#duration');
        DOM.progress = $('#progress');
        DOM.seekInput = $('#seek-input');
        DOM.seekDiv = $('#seek-div');

        DOM.height = $('#height');

        // assign video source paths
        /*
        for (let i=0; i<10; i++)
            DOM.cameras.eq(i).data('path', './videos/video' + o.toString() + '.MP4');
            */
    }

    function bindEvents() {

        $(document).on('keydown', keyScrub);

        // initialize video
        DOM.vid.item(1).addEventListener('loadedmetadata', initVideo);
        $(window).on("resize", fitWindow);

        // fullscreen buttons for each mini vid
        for (let i=0; i < 11; i++) {
            DOM.maximize.eq(i).on('click', fullScreen.bind(null, i));
        }

        // Progress bar use and updatess
        DOM.play.on('click', togglePlay);
        DOM.progress.on('click', renderProgress.bind(DOM.progress));
        DOM.seekInput.on({
            mousemove: seeking,
            mouseleave: function() { DOM.seekDiv.hide(); },
            input: skip
        });
        DOM.vid.item(1).addEventListener('timeupdate', updateTimeHeight);
    }

    /* ----- EVENT HANDLERS ----- */

    /*
    Toggles video playing in every video syncronously
    */
    function togglePlay() {
        DOM.icons.toggleClass("hidden");

        if (DOM.vid.item(1).paused || DOM.vid.item(1).ended
                || DOM.vid.item(0).paused || DOM.vid.item(0).ended) {
            DOM.vid.forEach(function (vid) {
                vid.play();
            });
        } else {
            DOM.vid.forEach(function (vid) {
                vid.pause();
            });
        }
        currTime = DOM.vid.item(1).currentTime;
        updateTimeHeight();
    }

    /*
    Gets, stores, and displays total duration of video
    */
    function initVideo() {
        duration = Math.round(DOM.vid.item(1).duration);
        let formatted = formatTime(duration);

        if (!isNaN(duration)) {
            DOM.seekInput.attr('max', duration);
            DOM.progress.attr('max', duration);
            DOM.duration.html(formatted);
        }
        fitWindow();
    }

    // Make video fit window whenever window size changes
    function fitWindow() {
        $('.video-container').css({
            "max-height": (window.innerHeight - 60) + "px",
            "max-width": ((window.innerHeight - 60)*(16/9)) + "px",
        });
    }

    /*
    Updates the time and height displayed on the UI. Entries from height are
    taken 0.5 sec apart and are lined up with currTime of the videos
    */

    function updateTimeHeight() {

        currTime = DOM.vid.item(1).currentTime;

        // update values of progress bar, bar input, and time displayed
        DOM.seekInput.val(currTime);
        DOM.progress.val(currTime);
        DOM.timeElapsed.html(formatTime(currTime));

        // displaying height from height.json
        let i = Math.round(currTime / 0.5);
        try {
            DOM.height.html("Height: " + height[i][0].toFixed(2) + " ft");
        } catch {
            console.log('out of range');
        }
    }

    /*
    Displays dynamic timestamp when hovering "seeking" over the progress
    bar. Time calculated from the horizontal position of the mouse in the
    window in proportion to the total time of the videos
    */

    function seeking(e) {
        skipTo = Math.round((e.offsetX / e.target.clientWidth) *
            parseInt(event.target.getAttribute('max'), 10));

        let formatted = formatTime(skipTo);
        // let rect = DOM.vid.getBoundingClientRect();

        DOM.seekDiv.show();
        DOM.seekDiv.html(formatted);
        // DOM.seekDiv.css('left', `${event.pageX - rect.left}px`);
        DOM.seekDiv.css('left', `${event.pageX}px`);
    }

    /*
    Use to skip forward to various points in the view
    */
    function skip() {
        DOM.vid.forEach( function(vid) {
            vid.currentTime = skipTo;
        });
        DOM.progress.val(skipTo);
        DOM.seekInput.val(skipTo);
        currTime = skipTo;
    }

    /*
    Moves progress bar to wherever the mouse clicked on it.
    */
    function renderProgress(e) {
        let pos = (e.pageX  - (this.offsetLeft + this.offsetParent.offsetLeft)) / this.offsetWidth;

        currTime = pos * DOM.vid.item(1).duration;
        DOM.vid.forEach( function(vid) {
            vid.currentTime = currTime;
        });

        seeking = false;
    }

    /*
    Allows scrubbing with the left and right arrow keys. Each press moves
    the video by 0.5s. Space also pauses the video.
    */
    function keyScrub(event) {
        if (skipTo == null) {
            skipTo = 0;
        } else {
            skipTo = currTime;
        }

        if (event.key == "ArrowRight") {
            skipTo += 0.5;
            skip();
        } else if (event.key == "ArrowLeft") {
            skipTo -= 0.5;
            skip();
        } else if (event.keyCode == 32) {
            togglePlay();
        }

    }

    /*
    Allows for fullscreen capability
    */
    function fullScreen(vid) {

        // pause everything
        DOM.icons.eq(0).removeClass("hidden");    // play icon
        DOM.icons.eq(1).addClass("hidden"); // pause icon
        DOM.vid.forEach(function (vid) {
            vid.pause();
        });
        currTime = DOM.vid.item(1).currentTime;
        updateTimeHeight();ss

        // currently full screen (vid 0 fullscreen)
        if (vid == 0) {

            // remove 4k source
            DOM.vid.item(0).children[0].src = "";
            DOM.vid.item(0).load();

            DOM.fullVidWindow.css("display", "none");
            DOM.allVidWindow.css("display", "block");
        }

        // currently minimzed (vid 1+ are mini players)
        else {
            // add 4k source
            let link = "./videos/video" + vid.toString() + "-4k.MP4";

            DOM.vid.item(0).children[0].src = link;
            DOM.vid.item(0).load();

            DOM.fullVidWindow.css("display", "block");
            DOM.allVidWindow.css("display", "none");
        }
    }


    /* ----- HELPER FUNCTIONS ----- */

    /*
    Formats time given in t sec into a string min:sec
    */
    function formatTime(t) {
        let min = Math.floor(Math.abs(t)/60);
        let sec = Math.floor(Math.abs(t)%60);
        if (sec < 10) {
            sec = '0' + sec;
        }
        return min + ':' + sec; // returns string of time
    }


    /*
    Swaps two videos upon clicking a button to go to a different camera.
    DEPRECIATED: viewing all cameras at once so no need to view
    */

    function swap(n) {
        currTime = DOM.vid.currentTime;

        let newPath = DOM.cameras.eq(n).data('path');
        DOM.vid.children[0].src = newPath;  // children[0] is <source>
        DOM.vid.load();
        initVideo();
        console.log(DOM.vid);

        try {
            skipTo = currTime;
            skip();
            DOM.vid.currentTime = currTime;
        } catch (e) {
            console.log(e);
        }
    }

    /* ----- PUBLIC METHODS & EXPORT ----- */

    function init() {
        cache();
        bindEvents();
    }

    return {
        init: init
    };
}();
