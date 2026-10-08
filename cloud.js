// My Clips in the cloud: once you sign in (an emailed link, no password), clips and their videos are saved
// to Supabase instead of this browser, so they're there on any device. Signed out, or with no project set in
// supabase-config.js, myclips.js keeps doing the job in this browser alone. app.js does the UI.
//   window.MYWAR_CLOUD = { MAX_BYTES, ready, user, onChange, signIn, signOut, all, put, remove, videoUrl, linkError }
//   (null when Supabase isn't configured or its library didn't load)
(function () {
  'use strict';

  var cfg = window.MYWAR_SUPABASE || {};
  window.MYWAR_CLOUD = null;
  if (!cfg.url || !cfg.anonKey || !window.supabase || !window.supabase.createClient) return;

  var BUCKET = 'clips', TABLE = 'clips';
  var MAX_BYTES = 50 * 1024 * 1024;     // the free plan's largest single upload; match file_size_limit in setup.sql

  // The emailed link lands back here with the session in the address: "#access_token=...&refresh_token=...".
  // app.js reads the hash as a clip id and rewrites the address on load, so take the tokens out first and
  // hand them to Supabase ourselves, rather than letting the library look for them later.
  var arrived = null, linkError = '';
  (function () {
    var h = location.hash.slice(1);
    if (!/(^|&)(access_token|error_description)=/.test(h)) return;
    var p = {};
    h.split('&').forEach(function (kv) {
      var i = kv.indexOf('=');
      if (i > 0) p[kv.slice(0, i)] = decodeURIComponent(kv.slice(i + 1).replace(/\+/g, ' '));
    });
    if (p.access_token && p.refresh_token) arrived = { access_token: p.access_token, refresh_token: p.refresh_token };
    else if (p.error_description) {
      linkError = /expired|invalid/i.test(p.error_description)
        ? 'That sign-in link has expired or was already used. Ask for a new one below.'
        : 'Sign-in didn’t work: ' + p.error_description;
    }
    history.replaceState(null, '', location.pathname + location.search);
  })();

  var sb = window.supabase.createClient(cfg.url, cfg.anonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, flowType: 'implicit' }
  });

  var current = null, listeners = [];
  function user() { return current; }
  function onChange(cb) { listeners.push(cb); }
  sb.auth.onAuthStateChange(function (event, session) {
    var next = (session && session.user) || null;
    if ((next && next.id) === (current && current.id)) { current = next; return; }   // token refreshes etc.
    current = next;
    listeners.forEach(function (cb) { try { cb(current); } catch (e) { console.warn(e); } });
  });

  // resolves with the signed-in user (or null) once any session in the link or in storage has been restored
  var ready = (arrived ? sb.auth.setSession(arrived) : sb.auth.getSession())
    .then(function (r) {
      if (r.error && arrived) linkError = 'That sign-in link has expired or was already used. Ask for a new one below.';
      current = (r.data && (r.data.user || (r.data.session && r.data.session.user))) || null;
      return current;
    })
    .catch(function () { return null; });

  function signIn(email) {
    return sb.auth.signInWithOtp({
      email: email,
      options: { emailRedirectTo: location.origin + location.pathname + '?tab=mine' }
    }).then(function (r) { if (r.error) throw r.error; });
  }
  function signOut() { return sb.auth.signOut().then(function (r) { if (r.error) throw r.error; }); }

  // ---------- clips ----------
  // a row, shaped like the records myclips.js keeps, so app.js treats both the same way
  function fromRow(r) {
    return {
      id: r.id, cloud: true, name: r.name, trick: r.trick, date: r.landed_on, spot: r.spot, style: r.style,
      lat: r.lat, lng: r.lng, city: r.city, country: r.country, thumb: r.thumb,
      videoPath: r.video_path, videoName: r.video_name, videoType: r.video_type, saved: r.created_at
    };
  }

  function all() {
    if (!current) return Promise.resolve([]);
    return sb.from(TABLE).select('*').order('landed_on', { ascending: false }).then(function (r) {
      if (r.error) throw r.error;
      return r.data.map(fromRow);
    });
  }

  function extOf(rec) {
    var m = /\.([a-z0-9]{2,5})$/i.exec(rec.videoName || '');
    if (m) return m[1].toLowerCase();
    return /quicktime/.test(rec.videoType || '') ? 'mov' : 'mp4';
  }

  // rec is a local-style record holding the video Blob; resolves with the saved cloud record (no Blob)
  function put(rec) {
    if (!current) return Promise.reject(new Error('you’re not signed in'));
    if (rec.video && rec.video.size > MAX_BYTES) {
      var e = new Error('too big'); e.tooBig = true; return Promise.reject(e);
    }
    var path = current.id + '/' + rec.id + '.' + extOf(rec);
    return sb.storage.from(BUCKET).upload(path, rec.video, {
      contentType: rec.videoType || rec.video.type || 'video/mp4', upsert: false, cacheControl: '3600'
    }).then(function (up) {
      if (up.error) throw up.error;
      return sb.from(TABLE).insert({
        id: rec.id, name: rec.name, trick: rec.trick, landed_on: rec.date, spot: rec.spot || '', style: rec.style,
        lat: rec.lat, lng: rec.lng, city: rec.city || '', country: rec.country || '', thumb: rec.thumb || null,
        video_path: path, video_name: rec.videoName || '', video_type: rec.videoType || '',
        video_size: rec.video ? rec.video.size : null
      }).select().single();
    }).then(function (ins) {
      if (ins.error) {
        // don't leave an orphaned video behind if the row couldn't be written
        sb.storage.from(BUCKET).remove([path]);
        throw ins.error;
      }
      return fromRow(ins.data);
    });
  }

  function remove(rec) {
    return sb.from(TABLE).delete().eq('id', rec.id).then(function (r) {
      if (r.error) throw r.error;
      return rec.videoPath ? sb.storage.from(BUCKET).remove([rec.videoPath]) : null;
    });
  }

  // videos are private, so playback uses a link that stops working after a few hours
  function videoUrl(path) {
    return sb.storage.from(BUCKET).createSignedUrl(path, 6 * 3600).then(function (r) {
      if (r.error) throw r.error;
      return r.data.signedUrl;
    });
  }

  window.MYWAR_CLOUD = {
    MAX_BYTES: MAX_BYTES, ready: ready, user: user, onChange: onChange, signIn: signIn, signOut: signOut,
    all: all, put: put, remove: remove, videoUrl: videoUrl, linkError: function () { return linkError; }
  };
})();
