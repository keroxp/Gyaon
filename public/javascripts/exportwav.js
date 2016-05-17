(function(){
	window.exportWAV = function(audioData, sampleRate) {
		var encodeWAV = function(samples, sampleRate) {
			var buffer = new ArrayBuffer(44 + samples.length * 2);
			var view = new DataView(buffer);
			var writeString = function(view, offset, string) {
				for (var i = 0, offs = offset|0, max = string.length|0; i < max; i=(i+1)|0){
					view.setUint8(offs + i, string.charCodeAt(i));
				}
			};
			var floatTo16BitPCM = function(output, offset, input) {
				for (var i = 0; i < input.length; i=(i+1)|0, offset=(offset+2)|0){
					var s = Math.max(-1, Math.min(1, input[i]));
					output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
				}
			};
			writeString(view, 0, 'RIFF');  // RIFFヘッダ
			view.setUint32(4, 32 + samples.length * 2, true); // これ以降のファイルサイズ
			writeString(view, 8, 'WAVE'); // WAVEヘッダ
			writeString(view, 12, 'fmt '); // fmtチャンク
			view.setUint32(16, 16, true); // fmtチャンクのバイト数
			view.setUint16(20, 1, true); // フォーマットID
			view.setUint16(22, 1, true); // チャンネル数
			view.setUint32(24, sampleRate, true); // サンプリングレート
			view.setUint32(28, sampleRate * 2, true); // データ速度
			view.setUint16(32, 2, true); // ブロックサイズ
			view.setUint16(34, 16, true); // サンプルあたりのビット数
			writeString(view, 36, 'data'); // dataチャンク
			view.setUint32(40, samples.length * 2, true); // 波形データのバイト数
			floatTo16BitPCM(view, 44, samples); // 波形データ
			return view;
		};
		var i, j;
		var mergeBuffers = function(audioData) {
			var sampleLength = 0;
			for (i = 0, max = audioData.length; i < max; i=(i+1)|0) {
				sampleLength = (sampleLength+audioData[i].length)|0;
			}
			var samples = new Float32Array(sampleLength);
			var sampleIdx = 0;
			for (i = 0, imax = audioData.length; i < imax; i=(i+1)|0) {
				for (j = 0, jmax = audioData[i].length; j < jmax; j=(j+1)|0) {
					samples[sampleIdx] = audioData[i][j];
					sampleIdx = (sampleIdx+1)|0;
				}
			}
			return samples;
		};
		var dataview = encodeWAV(mergeBuffers(audioData), sampleRate);
		var audioBlob = new Blob([dataview], { type: 'audio/wav' });
		return audioBlob;
	};
}).call(this);
