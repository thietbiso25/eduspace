// Lấy mã video từ các dạng liên kết YouTube phổ biến
export function ytId(url) {
  try {
    const u = new URL(url);
    const h = u.hostname.replace(/^(www|m|music)\./, '');
    let id = null;
    if (h === 'youtu.be') id = u.pathname.slice(1).split('/')[0];
    else if (h === 'youtube.com') {
      if (u.pathname === '/watch') id = u.searchParams.get('v');
      else {
        const m = u.pathname.match(/^\/(shorts|embed|live)\/([^/?]+)/);
        if (m) id = m[2];
      }
    }
    return id && /^[\w-]{6,20}$/.test(id) ? id : null;
  } catch (e) {
    return null;
  }
}
