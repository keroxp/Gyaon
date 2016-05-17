(function() {
    navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);
    var Recorder = function(audioContext, bufferSize) {
        this.audioContext = audioContext;
        this.bufferSize = bufferSize || 4096;
        this.audioContext = '';
        this.bufferSize = '';
        this.audioBufferArray = [];
        this.stream = '';
    };
    Recorder.prototype.recording = function(stream) {
        var o = this;
        o.stream = stream;
        var mediaStreamSource =
            o.audioContext.createMediaStreamSource(stream);
        var scriptProcessor =
            o.audioContext.createScriptProcessor(o.bufferSize, 1, 1);
        mediaStreamSource.connect(scriptProcessor);
        o.audioBufferArray = [];
        scriptProcessor.onaudioprocess = function(event) {
            var channel = event.inputBuffer.getChannelData(0);
            var buffer = new Float32Array(o.bufferSize);
            for (var i = 0; i < o.bufferSize; i++) {
                buffer[i] = channel[i];
            }
            o.audioBufferArray.push(buffer);
        };
        //この接続でonaudioprocessが起動
        scriptProcessor.connect(o.audioContext.destination);
        o.scriptProcessor = scriptProcessor;
    };
    Recorder.prototype.recStart = function() {
        var o = this;
        if (o.stream) {
            o.recording(o.stream);
        } else {
            navigator.getUserMedia({
                    video: false,
                    audio: true
                },
                function(stream) {
                    o.recording(stream);
                },
                function(err) {
                    console.log(err.name ? err.name : err);
                }
            );
        }
    };
    Recorder.prototype.cStop = function() {
        var o = this;
        o.scriptProcessor.disconnect();
        if (o.stream) {
            o.stream.stop();
            o.stream = null;
        }
    };
    Recorder.prototype.getAudioBufferArray = function() {
        var o = this;
        return o.audioBufferArray;
    };
    Recorder.prototype.getAudioBuffer = function() {
        var o = this;
        var buffer = o.audioContext.createBuffer(
            1,
            o.audioBufferArray.length * o.bufferSize,
            o.audioContext.sampleRate
        );
        var channel = buffer.getChannelData(0);
        for (var i = 0; i < o.audioBufferArray.length; i++) {
            for (var j = 0; j < o.bufferSize; j++) {
                channel[i * o.bufferSize + j] = o.audioBufferArray[i][j];
            }
        }
        return buffer;
    };
    window.Recorder = Recorder;
}).call(this);
