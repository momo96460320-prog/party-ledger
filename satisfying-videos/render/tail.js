  window.__boot = () => { initAudio(); running = true; reset(); last = 0; };
  window.__frame = dt => {
    __V.t += dt;
    __timers.sort((a, b) => a.at - b.at);
    while (__timers.length && __timers[0].at <= __V.t) __timers.shift().fn();
    loop(__V.t * 1000);
  };
  window.__wav = async () => {
    const buf = await ac.startRendering();
    const n = Math.floor(__V.t * buf.sampleRate), L = buf.getChannelData(0), R = buf.getChannelData(1);
    const out = new DataView(new ArrayBuffer(44 + n * 4));
    const w = (o, str) => { for (let i = 0; i < str.length; i++) out.setUint8(o + i, str.charCodeAt(i)); };
    w(0, 'RIFF'); out.setUint32(4, 36 + n * 4, true); w(8, 'WAVE'); w(12, 'fmt '); out.setUint32(16, 16, true);
    out.setUint16(20, 1, true); out.setUint16(22, 2, true); out.setUint32(24, buf.sampleRate, true); out.setUint32(28, buf.sampleRate * 4, true);
    out.setUint16(32, 4, true); out.setUint16(34, 16, true); w(36, 'data'); out.setUint32(40, n * 4, true);
    for (let i = 0; i < n; i++) { out.setInt16(44 + i * 4, Math.max(-1, Math.min(1, L[i])) * 32767, true); out.setInt16(46 + i * 4, Math.max(-1, Math.min(1, R[i])) * 32767, true); }
    const u8 = new Uint8Array(out.buffer); let str = '';
    for (let i = 0; i < u8.length; i += 0x8000) str += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
    return btoa(str);
  };
})();
</script>