import sys
src,dst=sys.argv[1],sys.argv[2]
s=open(src).read()
def r(a,b,cnt=1):
    global s
    assert a in s, a[:60]
    s=s.replace(a,b,cnt) if cnt else s.replace(a,b)
r("<script>\n(() => {","<script>\n(() => {\n  const __V = window.__V = { t: 0 }; const __vt = () => __V.t; const __timers = [];\n  const vSetTimeout = (fn, ms) => __timers.push({ at: __V.t + ms / 1000, fn });")
r("new (window.AudioContext || window.webkitAudioContext)()","new OfflineAudioContext(2, 48000 * 170, 48000)")
r("ac.currentTime","__vt()",0)
r("performance.now()","(__V.t * 1000)",0)
s=s.replace("setTimeout(","vSetTimeout(").replace("vvSetTimeout(","vSetTimeout(")
r("    state = 'done'; stateT = 0; total = bounces;","    state = 'done'; stateT = 0; total = bounces; window.__done = (window.__done || 0) + 1;")
r("    draw();\n    requestAnimationFrame(loop);\n  }","    draw();\n  }")
r("  [hidden] { display: none !important; }","  [hidden] { display: none !important; }\n  #mute, #rare, #start { display: none !important; }\n  body { padding: 0 !important; } #frame { border-radius: 0 !important; box-shadow: none !important; }")
tail=open(sys.argv[3]).read()
r("})();\n</script>",tail)
open(dst,'w').write(s)
