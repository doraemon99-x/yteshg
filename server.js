// cPanel/lsnode memanggil startup file dengan require() (CommonJS).
// File ini me-load app ESM kita (index.mjs) via dynamic import.
(async () => {
  try {
    await import('./index.mjs');
  } catch (err) {
    console.error('Failed to start ESM app:', err);
    process.exit(1);
  }
})();
