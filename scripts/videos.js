/*
VIDEO SETTING SLIDERS

Functions that change the brightness/contrast of MJPG streams
and hide/reveal and reset the sliders when the settings button is
clicked.
*/
var videos = function() {

    var whichVid;
    var DOM = {};
    var duration;   // in sec
    var formattedTime;
    var skipTo;

    /* ----- INITIALIZING FUNCTIONS ----- */

    function cache() {
        DOM.vid0 = document.getElementById('video-0')
        DOM.vid1 = document.getElementById('video-1');
        DOM.vid2 = document.getElementById('video-2');
        DOM.vid3 = document.getElementById('video-3');
        DOM.vid4 = document.getElementById('video-4');
        DOM.vid5 = document.getElementById('video-5');
        DOM.vid6 = document.getElementById('video-6');

        DOM.controls = document.getElementById('video-controls');
        DOM.icons = document.querySelectorAll('.playback-icons use');
        DOM.play = document.getElementById('play');
        DOM.timeElapsed = document.getElementById('time-elapsed');
        DOM.duration = document.getElementById('duration');
        DOM.progress = document.getElementById('progress');
        DOM.seekIn =  document.getElementById('seek-input');
        DOM.seekDiv = document.getElementById('seek-div');

        DOM.full0 = document.getElementById('fullscreen-0');
        DOM.full1 = document.getElementById('fullscreen-1');
        DOM.full2 = document.getElementById('fullscreen-2');
        DOM.full3 = document.getElementById('fullscreen-3');
        DOM.full4 = document.getElementById('fullscreen-4');
        DOM.full5 = document.getElementById('fullscreen-5');
        DOM.full6 = document.getElementById('fullscreen-6');

        DOM.fullVid = document.getElementById('full-video');
        DOM.allVideo = document.getElementById('all-videos');
    }

    function bindEvents() {
        DOM.controls.classList.remove('hidden');
        DOM.play.addEventListener('click', togglePlay);

        DOM.progress.addEventListener('click', function(e) {
            var pos = (e.pageX  - (this.offsetLeft + this.offsetParent.offsetLeft)) / this.offsetWidth;
            DOM.vid1.currentTime = pos * DOM.vid1.duration;
            DOM.vid2.currentTime = pos * DOM.vid1.duration;
            DOM.vid3.currentTime = pos * DOM.vid1.duration;
            DOM.vid4.currentTime = pos * DOM.vid1.duration;
            DOM.vid5.currentTime = pos * DOM.vid1.duration;
            DOM.vid6.currentTime = pos * DOM.vid1.duration;
        });

        DOM.vid1.addEventListener('loadedmetadata', initVideo);
        DOM.vid1.addEventListener('timeupdate', updateTime);

        DOM.seekIn.addEventListener('mousemove', updateSeeking);
        DOM.seekIn.addEventListener('mouseleave', function() {
            DOM.seekDiv.style.display = 'none';
        });
        DOM.seekIn.addEventListener('input', skip);

        /*
        DOM.full1.addEventListener('click', toggleFullScreen.bind(null, 0));
        DOM.full1.addEventListener('click', toggleFullScreen.bind(null, 1));
        DOM.full2.addEventListener('click', toggleFullScreen.bind(null, 2));
        DOM.full3.addEventListener('click', toggleFullScreen.bind(null, 3));
        DOM.full4.addEventListener('click', toggleFullScreen.bind(null, 4));
        DOM.full5.addEventListener('click', toggleFullScreen.bind(null, 5));
        DOM.full6.addEventListener('click', toggleFullScreen.bind(null, 6));
        */
    }

    /* ----- EVENT HANDLERS ----- */

    function togglePlay() {
        DOM.icons.forEach(icon => icon.classList.toggle('hidden'));
        if (DOM.vid1.paused || DOM.vid1.ended) {
            DOM.vid1.play();
            DOM.vid2.play();
            DOM.vid3.play();
            DOM.vid4.play();
            DOM.vid5.play();
            DOM.vid6.play();
        } else {
            DOM.vid1.pause();
            DOM.vid2.pause();
            DOM.vid3.pause();
            DOM.vid4.pause();
            DOM.vid5.pause();
            DOM.vid6.pause();
        }
    }

    function formatTime(sec) {
        var min = Math.floor(Math.abs(sec)/60);
        var sec = Math.floor(Math.abs(sec)%60);
        if (sec < 10) {
            sec = '0' + sec;
        }
        return min + ':' + sec; // returns string of time
    }

    function initVideo() {
        duration = Math.round(DOM.vid1.duration);
        formattedTime = formatTime(duration);
        DOM.seekIn.setAttribute('max', duration);
        DOM.progress.setAttribute('max', duration);
        DOM.duration.innerText = formattedTime;

        console.log("duration: " + duration);
        console.log("formattedTime: " + formattedTime);
        //DOM.duration.setAttribute(duration);
    }

    function updateTime() {
        var sec = DOM.vid1.currentTime;
        DOM.seekIn.value = sec;
        DOM.progress.value = sec;
    }

    function updateSeeking(e) {
        skipTo = Math.round((e.offsetX / e.target.clientWidth) *
            parseInt(event.target.getAttribute('max'), 10));

        var formatted = formatTime(skipTo);
        var rect = DOM.vid1.getBoundingClientRect();

        DOM.seekDiv.style.display = 'block';
        DOM.seekDiv.innerText = formatted;
        DOM.seekDiv.style.left = `${event.pageX - rect.left}px`;
    }

    function skip() {
        DOM.vid1.currentTime = skipTo;
        DOM.vid2.currentTime = skipTo;
        DOM.vid3.currentTime = skipTo;
        DOM.vid4.currentTime = skipTo;
        DOM.vid5.currentTime = skipTo;
        DOM.vid6.currentTime = skipTo;
        DOM.progress.value = skipTo;
        DOM.seekIn.value = skipTo;
    }

/*
    function toggleFullScreen(x) {
        if (x == 0) {   // currently full screen
            document.querySelector("#fullscreen > source").src
        } else {        // currently minimzed
            DOM.fullVid.toggle();
        }


        DOM.allVideos.toggle();
    }
*/

    function getVideo(x) {
        switch(x) {
            case 0: return DOM.vid0;
            case 1: return DOM.vid1;
            case 2: return DOM.vid2;
            case 3: return DOM.vid3;
            case 4: return DOM.vid4;
            case 5: return DOM.vid5;
            case 6: return DOM.vid6;
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
