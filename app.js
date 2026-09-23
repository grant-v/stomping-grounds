(function () {
  'use strict';

  var slug = function (s) {
    return String(s).toLowerCase().normalize('NFD').replace(/[^\x00-\x7f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var $ = function (id) { return document.getElementById(id); };

  // ---------- data ----------
  var seen = {};
  // episodes with no known location stay in the list (stats + video) but get no pin
  // Two collections share the map: Thrasher's My War episodes (data.js) and famous clips (classics.js).
  // Classics arrive in research-JSON shape, so fold them into the same fields the My War entries use.
  var classics = (window.MYWAR_CLASSICS || []).filter(function (c) { return c && c.skater; }).map(function (c) {
    var stats = {};
    // spot features credited to "Various (names…)" are headlined by the spot; the names become a stat
    var crew = /^various\b\s*\(?([^)]*)\)?/i.exec(c.skater);
    if (crew) {
      if (crew[1]) stats.featuring = crew[1];
      c.skater = String(c.spot || 'Various').replace(/\s*\(.*$/, '');
    }
    if (c.video) stats.appearedIn = c.video;
    Object.keys(c.stats || {}).forEach(function (k) { stats[k] = c.stats[k]; });
    return {
      series: c.series || 'classic', style: c.style, skater: c.skater, trick: c.trick, spot: c.spot, city: c.city, country: c.country,
      lat: c.lat, lng: c.lng, approx: c.precision === 'city', year: c.year, title: c.video || c.youtubeTitle,
      youtubeId: c.youtubeId, start: c.startSeconds, stats: stats, summary: c.summary, camera: c.camera
    };
  });
  // Every clip belongs to one discipline tab: 'street' (default) or 'park' (vert, bowl, mega ramp, DIY transition).
  var DATA = (window.MYWAR || []).concat(classics).map(function (d) {
    d.series = d.series || 'mywar';
    d.style = d.style === 'park' ? 'park' : 'street';
    d.located = typeof d.lat === 'number' && typeof d.lng === 'number';
    var id = slug(d.skater + '-' + (d.spot || d.trick || d.year || ''));
    while (seen[id]) id += '-2';
    seen[id] = true;
    d.id = id;
    d.hay = [d.skater, d.title, d.trick, d.spot, d.city, d.country, d.year].join(' ').toLowerCase();
    return d;
  });
  var byId = {};
  DATA.forEach(function (d) { byId[d.id] = d; });

  // ---------- skaters (skaters.js) ----------
  // A card's clips are found by name: nicknames in quotes and accents are ignored, and shared credits
  // ("Tony Hawk & Andy Macdonald") count for each name.
  var nameKey = function (s) { return slug(String(s).replace(/\s*"[^"]*"\s*/g, ' ')); };
  var SKATERS = (window.MYWAR_SKATERS || []).filter(function (s) { return s && s.name; }).map(function (s) {
    s.id = slug(s.name.replace(/\s*"[^"]*"\s*/g, ' '));
    var keys = {};
    [s.name].concat(s.matches || []).forEach(function (n) { keys[nameKey(n)] = 1; });
    s.clips = DATA.filter(function (d) {
      return String(d.skater).split(/\s*(?:&|,| and )\s*/).some(function (p) { return keys[nameKey(p)]; });
    });
    return s;
  });
  var bySkater = {};
  SKATERS.forEach(function (s) { bySkater[s.id] = s; });

  function ageLine(s) {
    if (!s.born) return '';
    var b = String(s.born).split('-').map(Number), now = new Date();
    if (s.died) return b[0] + '–' + String(s.died).slice(0, 4);
    if (b.length < 3) return 'Born ' + b[0];
    var m = now.getMonth() + 1, early = m < b[1] || (m === b[1] && now.getDate() < b[2]);
    return 'Age ' + (now.getFullYear() - b[0] - (early ? 1 : 0));
  }
  // portraits come from the local copies fetch-portraits.sh saved (portraits.js); the Wikimedia URL is the fallback
  var PORTRAITS = window.MYWAR_PORTRAITS || {};
  // Most street pros have no freely licensed portrait. Rather than show initials, fall back to the
  // thumbnail of their own clip — the same YouTube image the dossier already uses.
  function clipThumb(s) {
    for (var i = 0; i < (s.clips || []).length; i++) if (s.clips[i].youtubeId) return s.clips[i].youtubeId;
    return null;
  }
  function photoHtml(s) {
    var initials = s.name.replace(/"[^"]*"/g, '').trim().split(/\s+/).map(function (w) { return w.charAt(0); }).join('').slice(0, 3);
    var src = PORTRAITS[s.id] || s.photo, cls = '';
    if (!src) {
      var v = clipThumb(s);
      // hqdefault is 4:3 with black bars on a widescreen video; .vid zooms past them
      if (v) { src = 'https://i.ytimg.com/vi/' + v + '/hqdefault.jpg'; cls = ' vid'; }
    }
    return '<span class="card-photo"><span class="ph" aria-hidden="true">' + esc(initials) + '</span>' +
      (src ? '<img class="shot' + cls + '" alt="" loading="lazy" src="' + esc(src) + '">' : '') + '</span>';
  }
  $('cards').innerHTML = SKATERS.map(function (s) {
    var n = s.clips.length;
    return '<button type="button" class="card" data-skater="' + s.id + '">' + photoHtml(s) +
      '<span class="card-name">' + esc(s.name) + '</span>' +
      '<span class="card-meta">' + esc([ageLine(s), s.country].filter(Boolean).join(' · ')) + '</span>' +
      ((s.titles || []).length ? '<span class="card-titles">' + s.titles.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</span>' : '') +
      '<span class="card-clips' + (n ? '' : ' none') + '">' + (n ? n + (n === 1 ? ' clip' : ' clips') + ' on the map' : 'No clips mapped yet') + '</span></button>';
  }).join('');
  // a portrait that fails to load leaves the initials showing
  $('cards').addEventListener('error', function (e) { if (e.target.tagName === 'IMG') e.target.remove(); }, true);

  // ---------- discipline (tab) + tally ----------
  var style = null;                       // 'street' | 'park' | 'skater' — set by the landing page, a tab or a skater card
  var who = null;                         // the skater whose clips are shown when style === 'skater'
  var POOL = [];                          // the clips on the current tab
  var uniq = function (k, list) {
    var o = {}; (list || POOL).forEach(function (d) { if (d[k]) o[d[k]] = 1; }); return Object.keys(o);
  };
  var ofStyle = function (s) { return DATA.filter(function (d) { return d.style === s; }); };
  function tally() {
    var years = uniq('year').map(Number).sort(function (a, b) { return a - b; });
    $('tally').innerHTML = [
      [POOL.length, 'Clips'],
      [uniq('country').length, 'Countries'],
      [uniq('city').length, 'Cities'],
      [!years.length ? '—' : years.length === 1 ? years[0] : years[0] + '–' + years[years.length - 1], 'Span']
    ].map(function (t) { return '<div><dt>' + t[1] + '</dt><dd>' + t[0] + '</dd></div>'; }).join('');
  }
  // landing page counts (filled in after SKATERS is built, below)
  function homeCounts() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-count]'), function (el) {
      if (el.dataset.count === 'skaters') {
        // dual nationals are stored as "USA / Finland", so split before counting
        var cs = {};
        SKATERS.forEach(function (s) {
          String(s.country || '').split('/').forEach(function (c) { c = c.trim(); if (c) cs[c] = 1; });
        });
        el.textContent = SKATERS.length + ' skaters · ' + Object.keys(cs).length + ' countries';
        return;
      }
      var list = ofStyle(el.dataset.count);
      el.textContent = list.length + ' clips · ' + uniq('country', list).length + ' countries';
    });
  }
  homeCounts();

  // ---------- map ----------
  var WORLD = [[-50, -150], [68, 170]];
  var map = L.map('map', { worldCopyJump: true, minZoom: 2, zoomSnap: 0.5, attributionControl: true });
  map.fitBounds(WORLD);
  // light gray canvas for the world view; satellite takes over up close so the spot itself is visible
  var ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services/';
  var credit = 'Tiles &copy; Esri · Videos &copy; their owners · Unofficial fan project';
  L.tileLayer(ESRI + 'Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', { maxZoom: 15, attribution: credit }).addTo(map);
  L.tileLayer(ESRI + 'Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}', { maxZoom: 15 }).addTo(map);
  L.tileLayer(ESRI + 'World_Imagery/MapServer/tile/{z}/{y}/{x}', { minZoom: 16, maxZoom: 19, attribution: credit }).addTo(map);
  map.setMaxZoom(19);
  window.myWarMap = map;

  var cluster = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 38,
    spiderfyDistanceMultiplier: 1.6,
    iconCreateFunction: function (c) {
      var n = c.getChildCount(), s = n < 5 ? 30 : n < 15 ? 38 : 46;
      return L.divIcon({ html: String(n), className: 'cluster', iconSize: [s, s] });
    }
  });
  map.addLayer(cluster);

  var markers = {};
  DATA.forEach(function (d) {
    if (!d.located) return;
    var m = L.marker([d.lat, d.lng], {
      icon: L.divIcon({ className: 'pin' + (d.approx ? ' approx' : '') + (d.series !== 'mywar' ? ' ' + d.series : ''), html: '<i></i>', iconSize: [28, 28] }),
      title: d.skater + ' — ' + (d.spot || d.city || ''),
      keyboard: true
    });
    m.bindTooltip(esc(d.skater) + '<small>' + esc([d.trick, d.spot].filter(Boolean).join(' · ')) + '</small>',
      { className: 'tip', direction: 'top', offset: [0, -8] });
    m.on('click', function () { select(d.id, { fly: false }); });
    markers[d.id] = m;
  });

  // ---------- filters + list ----------
  // country / year options only list what the current tab holds
  var fill = function (sel, vals) {
    while (sel.options.length > 1) sel.remove(1);
    vals.forEach(function (v) { var o = document.createElement('option'); o.value = v; o.textContent = v; sel.appendChild(o); });
  };
  var visible = [];
  var current = null;

  function clearFilters() { $('q').value = ''; $('series').value = ''; $('country').value = ''; $('year').value = ''; }

  // bounds of every pinned clip on the tab, so "zoom out" frames the tab rather than the whole globe
  function tabBounds() {
    var pts = POOL.filter(function (d) { return d.located; }).map(function (d) { return [d.lat, d.lng]; });
    if (pts.length === 1) return L.latLng(pts[0]).toBounds(600000);
    return pts.length ? L.latLngBounds(pts).pad(0.12) : L.latLngBounds(WORLD);
  }

  function pressTab(name) {
    Array.prototype.forEach.call(document.querySelectorAll('#tabs button'), function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.style === name));
    });
  }
  // shared by the tabs and the skater view: new pool, fresh filters, per-pool totals
  function usePool(list) {
    POOL = list;
    tally();
    clearFilters();
    fill($('country'), uniq('country').sort());
    fill($('year'), uniq('year').map(Number).sort(function (a, b) { return b - a; }));
    // a clip that isn't in the new pool can't stay open
    if (current && POOL.indexOf(byId[current]) < 0) closeDossier();
    apply();
  }

  function setStyle(s, opt) {
    opt = opt || {};
    if (s !== 'park') s = 'street';
    if (s === style) return;
    style = s; who = null;
    $('who').hidden = true;
    pressTab(s);
    hideSkaters();
    usePool(ofStyle(s));
    if (!opt.keepView) map.flyToBounds(tabBounds(), { duration: 0.8 });
    history.replaceState(null, '', location.pathname + '?tab=' + s + location.hash);
  }

  // one skater's clips, from every discipline
  function setSkater(id, opt) {
    var s = bySkater[id]; if (!s) return;
    opt = opt || {};
    style = 'skater'; who = s;
    pressTab('skaters');
    hideSkaters(); hideHome();
    $('who').innerHTML = photoHtml(s) +
      '<div><div class="who-name">' + esc(s.name) + '</div>' +
      '<div class="who-meta">' + esc([ageLine(s), s.hometown || s.country].filter(Boolean).join(' · ')) +
      (s.photoCredit ? '<span class="who-credit">' + esc(s.photoCredit) + (s.photoPage ? ' (<a href="' + esc(s.photoPage) + '" target="_blank" rel="noopener">source</a>)' : '') + '</span>' : '') +
      '</div></div>' +
      '<button type="button" class="who-back" id="whoBack">All skaters</button>';
    $('who').hidden = false;
    $('whoBack').onclick = showSkaters;
    usePool(s.clips);
    if (!opt.keepView) map.flyToBounds(tabBounds(), { duration: 0.8 });
    history.replaceState(null, '', location.pathname + '?skater=' + id + location.hash);
  }

  function showSkaters() {
    hideHome();
    pressTab('skaters');
    $('skaters').hidden = false;
    $('skaters').scrollTop = 0;
    history.replaceState(null, '', location.pathname + '?tab=skaters');
  }
  function hideSkaters() { $('skaters').hidden = true; }

  function showHome() {
    if (!$('dossier').hidden) closeDossier();
    hideSkaters();
    $('home').hidden = false;
    document.body.classList.add('at-home');
  }
  function hideHome() {
    $('home').hidden = true;
    document.body.classList.remove('at-home');
    map.invalidateSize();
  }
  Array.prototype.forEach.call(document.querySelectorAll('.pick, #tabs button'), function (b) {
    b.addEventListener('click', function () {
      if (b.dataset.style === 'skaters') return showSkaters();
      var first = !style;
      setStyle(b.dataset.style, { keepView: first });
      hideHome();
      if (first) map.fitBounds(tabBounds(), { animate: false });
    });
  });
  $('cards').addEventListener('click', function (e) {
    var c = e.target.closest('.card');
    if (c) setSkater(c.dataset.skater);
  });
  $('homeLink').addEventListener('click', function (e) { e.preventDefault(); showHome(); });
  $('back').addEventListener('click', showHome);

  function place(d) {
    var p = [d.city, d.country].filter(Boolean).join(', ');
    return d.located ? p : 'Location unknown' + (p ? ' (' + p + ')' : '');
  }

  function apply() {
    var q = $('q').value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    var c = $('country').value, y = $('year').value, sort = $('sort').value, s = $('series').value;
    visible = POOL.filter(function (d) {
      if (s && d.series !== s) return false;
      if (c && d.country !== c) return false;
      if (y && String(d.year) !== y) return false;
      return q.every(function (w) { return d.hay.indexOf(w) > -1; });
    });
    visible.sort(function (a, b) {
      if (sort === 'skater') return a.skater.localeCompare(b.skater);
      var dy = (a.year || 0) - (b.year || 0);
      return (sort === 'year-asc' ? dy : -dy) || a.skater.localeCompare(b.skater);
    });

    cluster.clearLayers();
    cluster.addLayers(visible.filter(function (d) { return d.located; }).map(function (d) { return markers[d.id]; }));

    var noun = who ? 'clips' : style + ' clips';
    $('count').textContent = visible.length === POOL.length
      ? POOL.length + ' ' + noun
      : visible.length + ' of ' + POOL.length + ' ' + noun;

    var ol = $('battles');
    if (!visible.length) {
      ol.innerHTML = '<li class="empty">No clips match. <button type="button" id="clear">Clear filters</button></li>';
      $('clear').onclick = function () { clearFilters(); apply(); };
      return;
    }
    ol.innerHTML = visible.map(function (d) {
      return '<li><button type="button" data-id="' + d.id + '"' + (d.id === current ? ' aria-current="true"' : '') + '>' +
        '<span class="b-skater">' + esc(d.skater) + '</span>' +
        '<span class="b-year">' + esc(d.year || '') + '</span>' +
        '<span class="b-trick">' + esc([d.trick, d.spot].filter(Boolean).join(' — ')) + '</span>' +
        '<span class="b-place">' + esc(place(d)) + '</span></button></li>';
    }).join('');
  }

  $('battles').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-id]');
    if (b) select(b.dataset.id, { fly: true });
  });
  ['q', 'series', 'country', 'year', 'sort'].forEach(function (id) { $(id).addEventListener('input', apply); });

  // ---------- dossier ----------
  var LABELS = {
    tries: 'Tries', attempts: 'Attempts', days: 'Days', sessions: 'Sessions', trips: 'Trips',
    timeSpan: 'Battle span', duration: 'Battle span', injuries: 'Injuries', boardsBroken: 'Boards broken',
    stairCount: 'Stairs', gapSize: 'Gap size', videoPart: 'Filmed for', video: 'Filmed for',
    appearedIn: 'Appeared in', dropHeight: 'Drop height', cover: 'Magazine cover', awards: 'Awards',
    firsts: 'First', spotStatus: 'Spot status', featuring: 'Featuring',
    event: 'Event', round: 'Round', score: 'Score', result: 'Result', ageAtTime: 'Age at the time'
  };
  var BIG = { tries: 1, attempts: 1, days: 1, sessions: 1, trips: 1, stairCount: 1, boardsBroken: 1, score: 1, ageAtTime: 1 };
  function label(k) {
    return LABELS[k] || k.replace(/[_-]/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
  }

  function statsHtml(d) {
    var rows = [['Trick', d.trick], ['Spot', d.spot]];
    var s = d.stats || {};
    // preferred form: ordered list of [label, value, highlight?]
    if (Array.isArray(s)) s.forEach(function (r) { rows.push([r[0], r[1], !!r[2]]); });
    else Object.keys(s).forEach(function (k) {
      var v = s[k];
      if (v == null || v === '' || (Array.isArray(v) && !v.length)) return;
      if (Array.isArray(v)) v = v.join('; ');
      if (typeof v === 'object') v = JSON.stringify(v);
      rows.push([label(k), v, BIG[k] && String(v).length < 8]);
    });
    return rows.filter(function (r) { return r[1]; }).map(function (r) {
      var wide = String(r[1]).length > 22 ? ' class="wide"' : '';
      return '<div' + wide + '><dt>' + esc(r[0]) + '</dt><dd' + (r[2] ? ' class="big"' : '') + '>' + esc(r[1]) + '</dd></div>';
    }).join('');
  }

  function videoHtml(d) {
    var search = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(
      (d.series === 'mywar' ? 'Thrasher My War ' : '') + [d.skater, d.trick, d.spot].filter(Boolean).join(' '));
    if (!d.youtubeId) {
      return '<p class="novideo">No verified video link for this one yet. <a href="' + search + '" target="_blank" rel="noopener">Search YouTube</a></p>';
    }
    return '<div class="video" data-yt="' + esc(d.youtubeId) + '"' + (d.start ? ' data-start="' + parseInt(d.start, 10) + '"' : '') + '>' +
      '<img alt="" loading="lazy" src="https://i.ytimg.com/vi/' + esc(d.youtubeId) + '/hqdefault.jpg">' +
      '<button type="button" aria-label="Play ' + esc(d.title || d.skater) + '"><span class="play">' +
      (d.series === 'mywar' ? 'Watch the battle' : 'Watch the clip') + '</span></button></div>';
  }

  function render(d) {
    var i = visible.indexOf(d), prev = visible[i - 1], next = visible[i + 1];
    var links = [];
    if (d.youtubeId) links.push('<a href="https://www.youtube.com/watch?v=' + esc(d.youtubeId) + '" target="_blank" rel="noopener">YouTube</a>');
    if (d.thrasherUrl) links.push('<a href="' + esc(d.thrasherUrl) + '" target="_blank" rel="noopener">Thrasher article</a>');
    if (d.located) links.push('<a href="https://www.google.com/maps?q=' + d.lat + ',' + d.lng + '" target="_blank" rel="noopener">Open in Maps</a>');

    $('dossierBody').innerHTML =
      '<p class="d-year">' + esc(d.year || '') + (d.title ? ' · ' + esc(d.title) : '') + '</p>' +
      '<h2 class="d-skater">' + esc(d.skater) + '</h2>' +
      (d.trick || d.spot ? '<p class="d-vs">' + esc(d.trick || '') + (d.trick && d.spot ? ' <b>vs.</b> ' : '') + esc(d.spot || '') + '</p>' : '') +
      '<p class="d-place">' + esc(place(d)) + '</p>' +
      (!d.located ? '<p class="d-approx">' + (d.series === 'mywar' ? 'Thrasher never named this spot' : 'The exact location is not published') + ', so it has no pin on the map yet.</p>'
        : d.approx ? '<p class="d-approx">Exact spot not confirmed — pinned at city level.</p>' : '') +
      videoHtml(d) +
      '<h3 class="d-h">' + (d.series === 'mywar' ? 'Battle stats' : d.series === 'contest' ? 'Contest stats' : 'Clip stats') + '</h3>' + (statsHtml(d)
        ? '<dl class="stats">' + statsHtml(d) + '</dl>'
        : '<p class="d-approx">No stats have been published for this one — the video is the record.</p>') +
      (d.summary ? '<h3 class="d-h">' + (d.series === 'mywar' ? 'The war' : 'The story') + '</h3><p class="d-summary">' + esc(d.summary) + '</p>' : '') +
      '<div class="links">' + links.join('') + '</div>' +
      '<div class="nav">' +
        (prev ? '<button type="button" data-id="' + prev.id + '">← ' + esc(prev.skater) + '</button>' : '<span></span>') +
        (next ? '<button type="button" data-id="' + next.id + '">' + esc(next.skater) + ' →</button>' : '<span></span>') +
      '</div>';
  }

  $('dossierBody').addEventListener('click', function (e) {
    var nav = e.target.closest('.nav button[data-id]');
    if (nav) return select(nav.dataset.id, { fly: true });
    var v = e.target.closest('.video');
    if (v && v.dataset.yt) {
      v.innerHTML = '<iframe title="YouTube video player" allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin" src="https://www.youtube-nocookie.com/embed/' +
        encodeURIComponent(v.dataset.yt) + '?autoplay=1&rel=0' + (v.dataset.start ? '&start=' + parseInt(v.dataset.start, 10) : '') + '"></iframe>';
      delete v.dataset.yt;
    }
  });

  function mark(id, on) {
    var m = markers[id]; if (!m) return;
    var el = m.getElement(); if (el) el.classList.toggle('on', on);
    m.options.icon.options.className = m.options.icon.options.className.replace(/ on\b/, '') + (on ? ' on' : '');
  }

  function select(id, opt) {
    var d = byId[id]; if (!d) return;
    // a deep link (or prev/next) may point outside the current pool: switch to its tab first, without the fly-out
    if (POOL.indexOf(d) < 0) setStyle(d.style, { keepView: true });
    if (!$('home').hidden) hideHome();
    hideSkaters();
    if (visible.indexOf(d) < 0) { clearFilters(); apply(); }
    if (current) mark(current, false);
    current = id;
    render(d);
    $('dossier').hidden = false;
    $('dossierBody').scrollTop = 0;
    $('sidebar').classList.remove('open');
    $('listToggle').setAttribute('aria-expanded', 'false');

    Array.prototype.forEach.call(document.querySelectorAll('#battles button'), function (b) {
      if (b.dataset.id === id) { b.setAttribute('aria-current', 'true'); b.scrollIntoView({ block: 'nearest' }); }
      else b.removeAttribute('aria-current');
    });

    if (location.hash.slice(1) !== id) history.replaceState(null, '', '#' + id);
    if (!d.located) return exit3D();
    var m = markers[id];
    // park the flat map over the spot so leaving the 3D view lands somewhere sensible
    map.setView(m.getLatLng(), 6, { animate: false });
    if (!enter3D(d)) cluster.zoomToShowLayer(m, function () { map.setView(m.getLatLng(), 18); });
    mark(id, true);
    if (location.hash.slice(1) !== id) history.replaceState(null, '', '#' + id);
  }

  // ---------- 3D spot view ----------
  // Satellite imagery draped over real terrain, with OSM building footprints extruded on top.
  var STYLE = {
    version: 8,
    sources: {
      sat: { type: 'raster', tiles: [ESRI + 'World_Imagery/MapServer/tile/{z}/{y}/{x}'], tileSize: 256, maxzoom: 19, attribution: credit },
      osm: { type: 'vector', url: 'https://tiles.openfreemap.org/planet' },
      dem: { type: 'raster-dem', tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'], encoding: 'terrarium', tileSize: 256, maxzoom: 14 }
    },
    layers: [
      { id: 'sat', type: 'raster', source: 'sat' },
      {
        id: 'buildings', type: 'fill-extrusion', source: 'osm', 'source-layer': 'building', minzoom: 14,
        paint: {
          'fill-extrusion-color': '#e4dfd2',
          'fill-extrusion-height': ['coalesce', ['get', 'render_height'], 6],
          'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0],
          'fill-extrusion-opacity': 0.5
        }
      }
    ],
    terrain: { source: 'dem', exaggeration: 1.15 },
    sky: { 'sky-color': '#9fc3e6', 'horizon-color': '#e8eef3', 'fog-color': '#e8eef3', 'sky-horizon-blend': 0.7, 'horizon-fog-blend': 0.7, 'fog-ground-blend': 0.2 }
  };
  var gl = null, glPin = null, orbiting = 0, trips = 0;
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function stopOrbit() { if (orbiting) cancelAnimationFrame(orbiting); orbiting = 0; }
  function orbit() {
    gl.setBearing(gl.getBearing() + 0.06);
    orbiting = requestAnimationFrame(orbit);
  }

  // ---------- Google photorealistic 3D (only when config.js has a key) ----------
  var KEY = (window.MYWAR_CONFIG || {}).googleMapsKey || '';
  var g3d = null, g3dPin = null, gLoading = null;

  function googleFailed() {
    if (!KEY) return;
    KEY = '';
    if (g3d) { g3d.remove(); g3d = null; }
    console.warn('Stomping Grounds: Google 3D did not load (check the key in config.js) — using the built-in 3D view.');
    $('spot3dGoogle').hidden = true;
    $('spot3dMap').hidden = false;
    if (current) enter3D(byId[current]);
  }
  function loadGoogle() {
    if (!gLoading) gLoading = new Promise(function (res, rej) {
      window.__myWarGoogle = function () { google.maps.importLibrary('maps3d').then(res, rej); };
      window.gm_authFailure = googleFailed; // bad / unauthorised key: drop back to the keyless view
      var s = document.createElement('script');
      s.src = 'https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(KEY) + '&v=beta&loading=async&callback=__myWarGoogle';
      s.onerror = rej;
      document.head.appendChild(s);
    });
    return gLoading;
  }
  // Ground height (metres above sea level) read from the same open terrain tiles the keyless view uses.
  // Resolves 0 if the tile can't be read, so the view still opens.
  function groundElevation(lat, lng) {
    return new Promise(function (res) {
      var z = 14, n = Math.pow(2, z), rad = lat * Math.PI / 180;
      var fx = (lng + 180) / 360 * n;
      var fy = (1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2 * n;
      var img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = function () {
        try {
          var c = document.createElement('canvas'); c.width = c.height = 256;
          var ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0);
          var p = ctx.getImageData(Math.min(255, Math.floor((fx % 1) * 256)), Math.min(255, Math.floor((fy % 1) * 256)), 1, 1).data;
          res(Math.max(0, p[0] * 256 + p[1] + p[2] / 256 - 32768));
        } catch (e) { res(0); }
      };
      img.onerror = function () { res(0); };
      setTimeout(function () { res(0); }, 4000);
      img.src = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/' + z + '/' + Math.floor(fx) + '/' + Math.floor(fy) + '.png';
    });
  }

  window.myWarGround = groundElevation;

  function enterGoogle3D(d) {
    $('mapwrap').classList.add('is3d');
    $('spot3d').hidden = false;
    $('spot3dMap').hidden = true;
    $('spot3dGoogle').hidden = false;
    $('hint').textContent = d.approx
      ? 'City-level view — exact spot unconfirmed. Drag to look around.'
      : 'Photorealistic 3D — drag to move, Shift-drag to tilt and orbit.';
    Promise.all([loadGoogle(), groundElevation(d.lat, d.lng)]).then(function (got) {
      var lib = got[0], ground = got[1];
      if (current !== d.id || !KEY) return;
      // the camera orbits `center`; at altitude 0 that point is underground anywhere above sea level
      var center = { lat: d.lat, lng: d.lng, altitude: ground };
      // per-spot framing can be set in data.js as camera: { tilt, range, heading }
      var cam = d.camera || {};
      // contest clips are pinned at the arena or park, so frame the whole venue rather than one stair set
      var end = { center: center, tilt: cam.tilt || (d.approx ? 50 : d.series === 'contest' ? 62 : 72),
        range: cam.range || (d.approx ? 2500 : d.series === 'contest' ? 420 : 160), heading: cam.heading == null ? -30 : cam.heading };
      if (!g3d) {
        g3d = new lib.Map3DElement({ center: center, range: 5000, tilt: 0, heading: 0, mode: 'SATELLITE' });
        $('spot3dGoogle').appendChild(g3d);
        // A rejected key never reports back for 3D maps — no 3D tiles ever arrive. So: if the tab has been
        // visible for 15s and Google has sent no tile data at all, drop back to the keyless view.
        // (Don't wait for "steady": an orbiting camera never is. Background tabs don't render, so they don't count.)
        var waited = 0;
        var tilesArriving = function () {
          // anything from Google beyond the script loader and fonts (which load even with a bad key)
          return performance.getEntriesByType('resource').some(function (r) {
            var host = r.name.split('/')[2] || '';
            return /google/.test(host) && !/^(maps\.googleapis\.com|fonts\.)/.test(host);
          });
        };
        var watchdog = setInterval(function () {
          if (tilesArriving()) return clearInterval(watchdog);
          if (document.visibilityState === 'visible' && (waited += 500) >= 15000) { clearInterval(watchdog); googleFailed(); }
        }, 500);
        g3d.addEventListener('gmp-steadychange', function () { clearInterval(watchdog); });
        g3d.addEventListener('gmp-error', function () { clearInterval(watchdog); googleFailed(); });
      } else {
        g3d.stopCameraAnimation();
        g3d.center = center; g3d.range = 5000; g3d.tilt = 0; g3d.heading = 0;
      }
      if (g3dPin) g3dPin.remove();
      g3dPin = new lib.Marker3DElement({ position: center, altitudeMode: 'CLAMP_TO_GROUND', extruded: true, label: d.spot || d.skater });
      g3d.appendChild(g3dPin);
      if (calm) { g3d.center = center; g3d.range = end.range; g3d.tilt = end.tilt; g3d.heading = end.heading; return; }
      g3d.addEventListener('gmp-animationend', function () {
        if (current === d.id) g3d.flyCameraAround({ camera: end, durationMillis: 240000, rounds: 3 });
      }, { once: true });
      g3d.flyCameraTo({ endCamera: end, durationMillis: 4200 });
    }).catch(googleFailed);
  }

  function enter3D(d) {
    if (KEY) { enterGoogle3D(d); return true; }
    if (!window.maplibregl) return false;
    var spot = [d.lng, d.lat];
    $('mapwrap').classList.add('is3d');
    $('spot3d').hidden = false;
    $('hint').textContent = d.approx
      ? 'City-level view — exact spot unconfirmed. Drag to look around.'
      : '3D spot view — drag to move, right-drag to tilt and orbit.';
    stopOrbit();
    if (!gl) {
      try {
        gl = new maplibregl.Map({ container: 'spot3dMap', style: STYLE, center: spot, zoom: 12, maxPitch: 80, attributionControl: false });
      } catch (e) { exit3D(); return false; }
      gl.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-left');
      gl.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');
      ['mousedown', 'touchstart', 'wheel'].forEach(function (ev) { gl.getCanvas().addEventListener(ev, stopOrbit, { passive: true }); });
      gl.on('moveend', function (e) { if (e.trip === trips && !calm && !$('spot3d').hidden) { stopOrbit(); orbit(); } });
      window.myWarSpot = gl;
    } else {
      gl.resize();
      gl.jumpTo({ center: spot, zoom: 12, pitch: 0, bearing: 0 });
    }
    if (glPin) glPin.remove();
    var el = document.createElement('div');
    el.className = 'pin on' + (d.approx ? ' approx' : '') + (d.series !== 'mywar' ? ' ' + d.series : '');
    el.innerHTML = '<i></i>';
    glPin = new maplibregl.Marker({ element: el }).setLngLat(spot).addTo(gl);

    // the dossier covers the right edge on wide screens; centre the spot in what's left
    var pad = { right: window.innerWidth > 860 ? $('dossier').offsetWidth : 0 };
    // the fly-in carries a tag so only its own arrival (not an interrupted earlier one) starts the orbit
    stopOrbit();
    trips++;
    gl.flyTo({ center: spot, zoom: d.approx ? 14.5 : d.series === 'contest' ? 16.3 : 17.6, pitch: d.approx ? 55 : 70, bearing: -30, padding: pad, duration: 4200, essential: !calm }, { trip: trips });
    return true;
  }

  function exit3D() {
    stopOrbit();
    if (g3d) g3d.stopCameraAnimation();
    $('spot3d').hidden = true;
    $('mapwrap').classList.remove('is3d');
  }

  function closeDossier() {
    exit3D();
    $('dossier').hidden = true;
    $('dossierBody').innerHTML = '';
    if (current) mark(current, false);
    current = null;
    Array.prototype.forEach.call(document.querySelectorAll('#battles [aria-current]'), function (b) { b.removeAttribute('aria-current'); });
    history.replaceState(null, '', location.pathname + location.search);
  }

  // re-apply the selected state when clustering re-creates marker elements
  cluster.on('animationend', function () { if (current) mark(current, true); });
  map.on('zoomend moveend', function () { if (current) mark(current, true); });

  $('close').onclick = closeDossier;
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !$('dossier').hidden) closeDossier(); });
  $('reset').onclick = function () {
    if (!$('dossier').hidden) closeDossier();
    map.flyToBounds(tabBounds(), { duration: 0.6 });
  };
  $('listToggle').onclick = function () {
    var open = $('sidebar').classList.toggle('open');
    this.setAttribute('aria-expanded', String(open));
  };
  window.addEventListener('hashchange', function () { var id = location.hash.slice(1); if (id && id !== current) select(id, { fly: true }); });

  // a deep link skips the landing page: #clip-id opens that clip on its tab, ?tab=park|street opens a tab
  var tab = /[?&]tab=(street|park|skaters)\b/.exec(location.search);
  var who0 = /[?&]skater=([a-z0-9-]+)/.exec(location.search);
  if (who0 && bySkater[who0[1]]) {
    hideHome();
    setSkater(who0[1], { keepView: true });
    map.fitBounds(tabBounds(), { animate: false });
    if (location.hash.length > 1 && byId[location.hash.slice(1)]) select(location.hash.slice(1), { fly: true });
  } else if (location.hash.length > 1 && byId[location.hash.slice(1)]) {
    hideHome();
    select(location.hash.slice(1), { fly: true });
  } else if (tab && tab[1] === 'skaters') {
    showSkaters();
  } else if (tab) {
    setStyle(tab[1], { keepView: true });
    hideHome();
    map.fitBounds(tabBounds(), { animate: false });
  } else {
    showHome();
  }
})();
