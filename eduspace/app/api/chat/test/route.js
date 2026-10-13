import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Kiểm tra chatbot: chỉ quản trị viên đã đăng nhập mới gọi được.
// Không bao giờ trả về khóa API, chỉ trả 3 ký tự đầu và độ dài để đối chiếu.
export async function POST(req) {
  const token = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  if (!token) return NextResponse.json({ error: 'auth' }, { status: 401 });

  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: ok } = await sb.rpc('is_admin');
  if (ok !== true) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const key = process.env.GEMINI_API_KEY || '';
  const out = { hasKey: !!key, keyStart: key.slice(0, 3), keyLength: key.length, envModel: process.env.GEMINI_MODEL || '', models: [] };
  const models = [...new Set([process.env.GEMINI_MODEL, 'gemini-2.5-flash-lite', 'gemini-2.5-flash'].filter(Boolean))];

  for (const m of models) {
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: 'Trả lời đúng một chữ: ok' }] }] }),
      });
      let detail = '';
      if (!r.ok) {
        const body = await r.text();
        try { detail = JSON.parse(body)?.error?.message || body; } catch { detail = body; }
      }
      out.models.push({ model: m, status: r.status, detail: String(detail).replace(key, '***').slice(0, 300) });
    } catch (e) {
      out.models.push({ model: m, status: 0, detail: String(e.message || e).slice(0, 200) });
    }
  }
  return NextResponse.json(out);
}
