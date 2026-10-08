// Your Supabase project, for saving My Clips to an account instead of only this browser.
// Supabase Dashboard -> Project Settings -> API (or "API Keys"): copy the Project URL and the
// publishable / anon public key. Both are meant to be public: the row-level security in
// supabase/setup.sql is what keeps each person's clips private, so this file IS committed
// (unlike config.js) and the live site uses it too. Never put the secret / service_role key here.
//
// Leave either value empty and My Clips keeps working the old way, saved in this browser only.
window.MYWAR_SUPABASE = {
  url: '',
  anonKey: ''
};
