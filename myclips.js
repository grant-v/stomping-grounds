// Your own clips: stored in this browser's IndexedDB, video file included. Nothing is uploaded anywhere,
// so a clip saved here stays in this browser on this device. app.js does the UI; this file is plain helpers:
//   window.MYWAR_MINE = { all, put, remove, persist, readMeta, thumbnail }
(function () {
  'use strict';

  var DB = 'stomping-grounds', STORE = 'clips', opening = null;

  function open() {
    if (!opening) opening = new Promise(function (res, rej) {
      if (!window.indexedDB) return rej(new Error('this browser has no storage for clips (a private window can cause this)'));
      var r;
      try { r = indexedDB.open(DB, 1); } catch (e) { return rej(e); }
      r.onupgradeneeded = function () { r.result.createObjectStore(STORE, { keyPath: 'id' }); };
      r.onsuccess = function () { res(r.result); };
      r.onerror = function () { rej(r.error); };
      r.onblocked = function () { rej(new Error('another Stomping Grounds tab is holding the storage open; close it and try again')); };
    });
    return opening;
  }

  // one request in its own transaction; resolves with the request's result once the transaction has committed
  function run(mode, make) {
    return open().then(function (db) {
      return new Promise(function (res, rej) {
        var tx = db.transaction(STORE, mode), req = make(tx.objectStore(STORE));
        tx.oncomplete = function () { res(req.result); };
        tx.onerror = tx.onabort = function () { rej(tx.error || req.error); };
      });
    });
  }

  function all() { return run('readonly', function (s) { return s.getAll(); }); }
  function put(rec) { return run('readwrite', function (s) { return s.put(rec); }); }
  function remove(id) { return run('readwrite', function (s) { return s.delete(id); }); }

  // ask the browser not to clear stored videos when the disk runs low (best effort; some browsers just say no)
  function persist() {
    try { if (navigator.storage && navigator.storage.persist) return navigator.storage.persist(); } catch (e) {}
    return Promise.resolve(false);
  }

  // ---------- what the video file itself knows ----------
  // Phones write where and when a clip was filmed into the file. iPhones and many Androids store the place as an
  // ISO 6709 string ("+34.0102-118.4960+010.000/") and iPhones the local time as "2025-06-14T16:20:05-0700".
  // That data sits in the "moov" box, which is at the start of some files and the end of others, so read both ends.
  var CHUNK = 4 * 1024 * 1024;

  function indexOf4(bytes, a, b, c, d) {
    for (var i = 0, n = bytes.length - 3; i < n; i++) {
      if (bytes[i] === a && bytes[i + 1] === b && bytes[i + 2] === c && bytes[i + 3] === d) return i;
    }
    return -1;
  }

  // fallback date: the movie header's creation time (seconds since 1904, UTC)
  function mvhdDate(bytes) {
    var i = indexOf4(bytes, 0x6d, 0x76, 0x68, 0x64);            // 'mvhd'
    if (i < 0 || i + 16 > bytes.length) return null;
    var dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    var secs = bytes[i + 4] === 1
      ? dv.getUint32(i + 8) * 4294967296 + dv.getUint32(i + 12)  // version 1: 64-bit
      : dv.getUint32(i + 8);                                     // version 0: 32-bit
    if (!secs) return null;
    var when = new Date((secs - 2082844800) * 1000), y = when.getUTCFullYear();
    return y < 1995 || y > new Date().getFullYear() + 1 ? null : when.toISOString().slice(0, 10);
  }

  // resolves { lat, lng, date } with whatever could be found; never rejects
  function readMeta(file) {
    var parts = [file.slice(0, Math.min(CHUNK, file.size))];
    if (file.size > CHUNK) parts.push(file.slice(Math.max(CHUNK, file.size - CHUNK)));
    return Promise.all(parts.map(function (b) { return b.arrayBuffer(); })).then(function (bufs) {
      var out = {};
      bufs.forEach(function (buf) {
        var bytes = new Uint8Array(buf), text = new TextDecoder('latin1').decode(bytes);
        if (out.lat == null) {
          var g = /([+-]\d{1,2}\.\d{2,})([+-]\d{1,3}\.\d{2,})(?:[+-]\d+(?:\.\d+)?)?\//.exec(text);
          if (g) {
            var lat = parseFloat(g[1]), lng = parseFloat(g[2]);
            if (Math.abs(lat) <= 90 && Math.abs(lng) <= 180 && (lat || lng)) { out.lat = lat; out.lng = lng; }
          }
        }
        if (!out.date) {
          var a = /(\d{4}-\d{2}-\d{2})T\d{2}:\d{2}:\d{2}[+-]\d{4}/.exec(text);
          out.date = a ? a[1] : mvhdDate(bytes);
        }
      });
      return out;
    }).catch(function () { return {}; });
  }

  // a still from about a third of the way in, as a small JPEG data URL; null if this browser can't decode the video
  function thumbnail(file) {
    return new Promise(function (res) {
      var url = URL.createObjectURL(file), v = document.createElement('video'), settled = false;
      function done(x) {
        if (settled) return;
        settled = true;
        URL.revokeObjectURL(url);
        v.removeAttribute('src');
        res(x);
      }
      v.muted = true;
      v.playsInline = true;
      v.preload = 'auto';
      v.onloadedmetadata = function () { v.currentTime = Math.min(1, (v.duration || 3) / 3); };
      v.onseeked = function () {
        try {
          var w = 480, h = Math.round(w * v.videoHeight / v.videoWidth) || 270;
          var c = document.createElement('canvas');
          c.width = w; c.height = h;
          c.getContext('2d').drawImage(v, 0, 0, w, h);
          done(c.toDataURL('image/jpeg', 0.8));
        } catch (e) { done(null); }
      };
      v.onerror = function () { done(null); };
      setTimeout(function () { done(null); }, 10000);
      v.src = url;
    });
  }

  window.MYWAR_MINE = { all: all, put: put, remove: remove, persist: persist, readMeta: readMeta, thumbnail: thumbnail };
})();
