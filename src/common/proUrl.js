// Every Pro link in the plugins goes through here, so in-plugin clicks are tagged and countable.
// In April 2026 most of them pointed at the bare homepage, untagged, and in-plugin referrals halved unnoticed.
let defaultProUrl = 'https://meowapps.com/';

const setProUrl = (url) => {
  if (url) {
    defaultProUrl = url;
  }
};

const getProUrl = (url, medium = 'pro-badge') => {
  const target = url || defaultProUrl;
  try {
    const parsed = new URL(target);
    if (!parsed.searchParams.has('utm_source')) {
      parsed.searchParams.set('utm_source', 'plugin');
      parsed.searchParams.set('utm_medium', medium);
      const page = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('page') : null;
      if (page) {
        parsed.searchParams.set('utm_campaign', page);
      }
    }
    return parsed.toString();
  }
  catch (e) {
    return target;
  }
};

export { setProUrl, getProUrl };
