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
        source;

    /* ----- INITIALIZING FUNCTIONS ----- */

    function cache() {
        DOM.vid = document.getElementById('video');
        //source = document.createElement('source');

        DOM.icons = $('.playback-icons use');
        DOM.play = $('#play');
        DOM.timeElapsed = $('#time-elapsed');
        DOM.duration = $('#duration');

        DOM.progress = $('#progress');
        DOM.seekInput = $('#seek-input');
        DOM.seekDiv = $('#seek-div');

        DOM.cameras = $('.nav-container button');
    }

    function bindEvents() {
        DOM.vid.addEventListener('loadedmetadata', initVideo);
        DOM.vid.addEventListener('timeupdate', updateTime);

        DOM.play.on('click', togglePlay);

        DOM.progress.on('click', renderProgress.bind(DOM.progress));

        DOM.seekInput.on({
            mousemove: seeking,
            mouseleave: function() { DOM.seekDiv.hide(); },
            input: skip
        });

        DOM.cameras.eq(0).on('click', swap.bind(null, 0));
        DOM.cameras.eq(1).on('click', swap.bind(null, 1));
        DOM.cameras.eq(2).on('click', swap.bind(null, 2));
        DOM.cameras.eq(3).on('click', swap.bind(null, 3));
        DOM.cameras.eq(4).on('click', swap.bind(null, 4));
        DOM.cameras.eq(5).on('click', swap.bind(null, 5));
    }

    function videoSrcs() {
        DOM.cameras.eq(0).data('path', '/Users/andrea/Downloads/videos/test1.MP4');
        DOM.cameras.eq(1).data('path', '/Users/andrea/Downloads/videos/test2.MP4');
        DOM.cameras.eq(2).data('path', '/Users/andrea/Downloads/videos/test3.MP4');
        DOM.cameras.eq(3).data('path', '/Users/andrea/Downloads/videos/test1.MP4');
        DOM.cameras.eq(4).data('path', '/Users/andrea/Downloads/videos/test2.MP4');
        DOM.cameras.eq(5).data('path', '/Users/andrea/Downloads/videos/test3.MP4');
    }

    /* ----- EVENT HANDLERS ----- */

    function togglePlay() {
        DOM.icons.toggleClass("hidden");
        if (DOM.vid.paused || DOM.vid.ended) {
            DOM.vid.play();
        } else {
            DOM.vid.pause();
        }
    }

    // t given in seconds
    function formatTime(t) {
        let min = Math.floor(Math.abs(t)/60);
        let sec = Math.floor(Math.abs(t)%60);
        if (sec < 10) {
            sec = '0' + sec;
        }
        return min + ':' + sec; // returns string of time
    }

    function initVideo() {

        duration = Math.round(DOM.vid.duration);
        let formatted = formatTime(duration);

        if (!isNaN(duration)) {
            DOM.seekInput.attr('max', duration);
            DOM.progress.attr('max', duration);
            DOM.duration.html(formatted);

            console.log("duration: " + duration);
            console.log("formattedDur: " + formatted);
        }
    }

    function updateTime() {
        let sec = DOM.vid.currentTime;
        DOM.seekInput.val(sec);
        DOM.progress.val(sec);
        DOM.timeElapsed.html(formatTime(sec));
    }

    function seeking(e) {
        skipTo = Math.round((e.offsetX / e.target.clientWidth) *
            parseInt(event.target.getAttribute('max'), 10));

        let formatted = formatTime(skipTo);
        let rect = DOM.vid.getBoundingClientRect();

        DOM.seekDiv.show();
        DOM.seekDiv.html(formatted);
        DOM.seekDiv.css('left', `${event.pageX - rect.left}px`);
    }

    function skip() {
        DOM.vid.currentTime = skipTo;
        DOM.progress.val(skipTo);
        DOM.seekInput.val(skipTo);
    }

    function renderProgress(e) {
        let pos = (e.pageX  - (this.offsetLeft + this.offsetParent.offsetLeft)) / this.offsetWidth;

        currTime = pos * DOM.vid.duration;
        DOM.vid.currentTime = currTime;
        console.log(currTime);
        seeking = false;
    }

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
        videoSrcs();
        bindEvents();
    }

    return {
        init: init
    };
}();
