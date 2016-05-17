$(function() {
    var audioContext = new AudioContext();
    var recorder = new Recorder(audioContext);

    $('#rec').mousedown(function(e) {
        recorder.recStart();
        console.log("a");
    }).mouseup(function(e) {
        recorder.recStop();
        var src = audioContext.createBufferSource();
        src.buffer = recorder.getAudioBuffer();
        src.connect(audioContext.destination);
        src.start();
    });

    $(".memo").on("mouseenter", function(e) {
        this.children[0].play();
        this.dataset.playing = true;
    }).on("mouseout", function(e) {
        this.children[0].pause();
        this.children[0].currentTime = 0;
				delete this.dataset.playing;
    });
});
