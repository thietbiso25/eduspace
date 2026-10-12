// Làm sạch HTML của bài viết trước khi hiển thị (chỉ giữ thẻ an toàn)
const ALLOWED = new Set(['P', 'DIV', 'BR', 'B', 'STRONG', 'I', 'EM', 'U', 'H2', 'H3', 'UL', 'OL', 'LI', 'IMG', 'A', 'BLOCKQUOTE', 'SPAN']);
const DROP = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'LINK', 'META', 'FORM', 'INPUT', 'BUTTON']);

export const isHtml = (s) => /<\/?[a-z][\s\S]*>/i.test(s || '');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const toHtml = (s) => (isHtml(s) ? s : esc(s || '').replace(/\n/g, '<br>'));

export function sanitize(html) {
  if (typeof window === 'undefined') return '';
  const doc = new DOMParser().parseFromString(html || '', 'text/html');
  const clean = (node) => {
    [...node.childNodes].forEach((ch) => {
      if (ch.nodeType === 3) return;
      if (ch.nodeType !== 1) { ch.remove(); return; }
      if (DROP.has(ch.tagName)) { ch.remove(); return; }
      clean(ch);
      if (!ALLOWED.has(ch.tagName)) { ch.replaceWith(...ch.childNodes); return; }
      const keep = {};
      if (ch.tagName === 'IMG') {
        const s = ch.getAttribute('src') || '';
        if (!/^https?:\/\//i.test(s)) { ch.remove(); return; }
        keep.src = s; keep.alt = ch.getAttribute('alt') || '';
      }
      if (ch.tagName === 'A') {
        const h = ch.getAttribute('href') || '';
        if (/^https?:\/\//i.test(h)) { keep.href = h; keep.target = '_blank'; keep.rel = 'noopener noreferrer'; }
      }
      const m = (ch.getAttribute('style') || '').match(/text-align:\s*(left|center|right|justify)/i);
      const al = (ch.getAttribute('align') || '').toLowerCase();
      if (m) keep.style = 'text-align:' + m[1].toLowerCase();
      else if (/^(left|center|right|justify)$/.test(al)) keep.style = 'text-align:' + al;
      [...ch.attributes].forEach((a) => ch.removeAttribute(a.name));
      Object.entries(keep).forEach(([k, v]) => ch.setAttribute(k, v));
    });
  };
  clean(doc.body);
  return doc.body.innerHTML;
}

export function excerpt(s, n = 140) {
  let text = s || '';
  if (isHtml(text)) text = new DOMParser().parseFromString(text, 'text/html').body.textContent || '';
  text = text.replace(/\s+/g, ' ').trim();
  return text.length > n ? text.slice(0, n) + '…' : text;
}
