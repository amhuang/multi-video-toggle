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
        initHeightTime = height[0][1];

    /* ----- INITIALIZING FUNCTIONS ----- */

    function cache() {

        DOM.vid = document.querySelectorAll("video");

        DOM.vidWindow = $('#all-videos');

        DOM.icons = $('.playback-icons use');
        DOM.play = $('#play');
        DOM.timeElapsed = $('#time-elapsed');
        DOM.duration = $('#duration');

        DOM.progress = $('#progress');
        DOM.seekInput = $('#seek-input');
        DOM.seekDiv = $('#seek-div');

        DOM.cameras = $('.nav-container button');
        DOM.height = $('#height');

        // setup();
    }

    function bindEvents() {

        $(document).on('keydown', keyScrub);
        // $(window).on('resize', resizing);

        DOM.vid.item(0).addEventListener('loadedmetadata', initVideo);
        DOM.vid.item(0).addEventListener('timeupdate', updateTime);

        DOM.play.on('click', togglePlay);
        DOM.progress.on('click', renderProgress.bind(DOM.progress));
        DOM.seekInput.on({
            mousemove: seeking,
            mouseleave: function() { DOM.seekDiv.hide(); },
            input: skip
        });

    }

    /*
    Attaches video path to an attribute of each camera button for swapping.
    */

    function setup() {
        for (let i=0; i<10; i++)
        DOM.cameras.eq(i).data('path', './videos/video' + o.toString() + '.MP4');
        resizing();
    }

    /* ----- EVENT HANDLERS ----- */

    /*
    Toggles video playing in every video syncronously
    */
    function togglePlay() {
        DOM.icons.toggleClass("hidden");

        if (DOM.vid.item(0).paused || DOM.vid.item(0).ended) {
            DOM.vid.forEach(function (vid) {
                vid.play();
            });
        } else {
            DOM.vid.forEach(function (vid) {
                vid.pause();
            });
        }
        currTime = DOM.vid.item(0).currentTime;
    }

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
    Gets, stores, and displays total duration of video
    */
    function initVideo() {
        duration = Math.round(DOM.vid.item(0).duration);
        let formatted = formatTime(duration);

        if (!isNaN(duration)) {
            DOM.seekInput.attr('max', duration);
            DOM.progress.attr('max', duration);
            DOM.duration.html(formatted);

            console.log("duration: " + duration);
            console.log("formattedDur: " + formatted);
        }
    }

    /*
    Updates the time displayed on the UI, as well as currTime which is
    stored privately
    */

    function updateTime() {
        currTime = DOM.vid.item(0).currentTime;
        DOM.seekInput.val(currTime);
        DOM.progress.val(currTime);
        DOM.timeElapsed.html(formatTime(currTime));
        renderHeight(currTime);
    }

    /*
    Displays dynamic timestamp when hovering "seeking" over the progress
    bar. Time calculated from the horizontal position of the mouse in the
    window in proportion to the total time of the videos
    */

    function seeking(e) {
        skipTo = Math.round((e.offsetX / e.target.clientWidth) *
            parseInt(event.target.getAttribute('max'), 10));
        console.log(skipTo);

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

        currTime = pos * DOM.vid.duration;
        DOM.vid.item(0).currentTime = currTime;
        console.log(Math.round);
        seeking = false;
    }

    /*
    Allows scrubbing with the left and right arrow keys. Each press moves
    the video by 0.5s.
    */

    function keyScrub(event) {
        if (skipTo == null) {
            skipTo = 0;
        } else {
            skipTo = currTime;
        }

        if (event.key == "ArrowRight") {
            skipTo += 0.5;
        } else if (event.key == "ArrowLeft") {
            skipTo -= 0.5;
        }
        skip();
    }

    /*
    Loads the height from height.json and displays it based off of
    the timestamp of the video. ENTRIES MUST BE TAKEN EVERY 0.5s APART
    FOR HEIGHT AND VIDEO TO LINE UP
    */

    function renderHeight(currTime) {
        let i = Math.round(currTime / 0.5);
        try {
            DOM.height.html("Height: " + height[i][0].toFixed(2) + " ft");
        } catch {
            console.log('out of range');
        }

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

    /*
    Used in setup. Fixes sizing of video in 16:9 to make sure entire video
    is visible in window.

    DEPRECIATED: Videos not view in full window by default ATM
    */

    function resizing() {
        DOM.vidWindow.css({
            "max-height": (window.innerHeight - 120) + "px",
            "max-width": ((window.innerHeight - 120)*(16/9)) + "px",
        });
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
