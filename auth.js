/* Lightweight client-side access gate for the Hand Surgery Education site.
   NOTE: This is a deterrent, not real security. The site is static (GitHub
   Pages), so a determined visitor can read the raw HTML. Do NOT put PHI or
   anything truly sensitive here. To change the password, update HASH below
   with the hash printed by:  node -e "s='newpass';x=0;for(c of s)x=(x*31+c.charCodeAt(0))&0xffffffff;console.log(x>>>0)" */
(function () {
  var KEY = 'hse_unlocked';
  var HASH = 877029371; // hash of the current shared password
  function hash(s) { var x = 0; for (var i = 0; i < s.length; i++) { x = (x * 31 + s.charCodeAt(i)) & 0xFFFFFFFF; } return x >>> 0; }

  // Already unlocked on this device — do nothing.
  if (localStorage.getItem(KEY) === String(HASH)) return;

  var ov = document.createElement('div');
  ov.id = 'hse-gate';
  ov.setAttribute('style', 'position:fixed;inset:0;z-index:2147483647;background:#16213e;display:flex;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;');
  ov.innerHTML =
    '<div style="background:#fff;border-radius:10px;padding:2rem 1.8rem;max-width:340px;width:90%;text-align:center;box-shadow:0 8px 30px rgba(0,0,0,.35);">' +
      '<div style="font-size:1.2rem;font-weight:700;color:#16213e;margin-bottom:.25rem;">Hand Surgery Education</div>' +
      '<div style="font-size:.85rem;color:#666;margin-bottom:1.3rem;">Access for NYU Ortho &amp; Plastic Surgery residents</div>' +
      '<input id="hse-pw" type="password" placeholder="Password" style="width:100%;padding:.6rem .8rem;font-size:1rem;border:1px solid #ccc;border-radius:6px;margin-bottom:.55rem;box-sizing:border-box;">' +
      '<div id="hse-err" style="color:#c0392b;font-size:.8rem;height:1rem;margin-bottom:.45rem;"></div>' +
      '<button id="hse-go" style="width:100%;padding:.6rem;background:#16213e;color:#fff;border:0;border-radius:6px;font-size:1rem;font-weight:600;cursor:pointer;">Enter</button>' +
    '</div>';

  // documentElement exists while the <head> script runs, so the opaque overlay
  // covers the page immediately — body content never visibly renders behind it.
  document.documentElement.appendChild(ov);

  var inp = ov.querySelector('#hse-pw');
  var err = ov.querySelector('#hse-err');
  function tryit() {
    if (hash(inp.value) === HASH) {
      localStorage.setItem(KEY, String(HASH));
      if (ov.parentNode) ov.parentNode.removeChild(ov);
    } else {
      err.textContent = 'Incorrect password';
      inp.value = '';
      inp.focus();
    }
  }
  ov.querySelector('#hse-go').addEventListener('click', tryit);
  inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') tryit(); });
  setTimeout(function () { inp.focus(); }, 50);
})();
