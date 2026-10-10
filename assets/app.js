// Research Notes — tooltips, archive filter/search, copy-to-clipboard for resume commands
(function () {
  var tip = document.querySelector('.tip');

  function show(el) {
    if (!tip || !el.dataset.tip) return;
    tip.textContent = el.dataset.tip;
    tip.hidden = false;
    var r = el.getBoundingClientRect();
    var w = tip.offsetWidth, h = tip.offsetHeight;
    var x = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), window.innerWidth - w - 8);
    var y = r.top - h - 8;
    if (y < 8) y = r.bottom + 8;
    tip.style.left = x + 'px';
    tip.style.top = y + 'px';
  }
  function hide() { if (tip) tip.hidden = true; }

  document.querySelectorAll('[data-tip]').forEach(function (el) {
    el.addEventListener('mouseenter', function () { show(el); });
    el.addEventListener('mouseleave', hide);
    el.addEventListener('focus', function () { show(el); });
    el.addEventListener('blur', hide);
  });
  window.addEventListener('scroll', hide, { passive: true });

  // the "now" line spans the timeline height
  var tl = document.querySelector('.tl');
  if (tl) tl.style.setProperty('--tl-h', (tl.offsetHeight - 30) + 'px');

  document.querySelectorAll('code.cmd').forEach(function (c) {
    c.addEventListener('click', function () {
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(c.textContent).then(function () {
        c.classList.add('copied');
        setTimeout(function () { c.classList.remove('copied'); }, 1200);
      }).catch(function () {});
    });
  });

  var rows = Array.prototype.slice.call(document.querySelectorAll('.dayrow'));
  if (!rows.length) return;
  var filters = document.querySelectorAll('.filter');
  var search = document.querySelector('.search');
  var project = '';

  function apply() {
    var q = (search && search.value || '').trim().toLowerCase();
    rows.forEach(function (r) {
      var okP = !project || (r.dataset.projects || '').split('|').indexOf(project) >= 0;
      var okQ = !q || (r.dataset.search || '').indexOf(q) >= 0;
      r.hidden = !(okP && okQ);
    });
  }
  filters.forEach(function (b) {
    b.addEventListener('click', function () {
      filters.forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      project = b.dataset.project || '';
      apply();
    });
  });
  if (search) search.addEventListener('input', apply);
})();
