import { NextResponse } from 'next/server';

// Giới hạn số câu hỏi mỗi IP mỗi ngày. Lưu trong bộ nhớ nên chỉ là lớp chặn cơ bản
// (mỗi máy chủ Vercel giữ bộ đếm riêng). Muốn chặt hơn, lưu bộ đếm vào Supabase.
const hits = new Map();

export async function POST(req) {
  const ip = (req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
  const key = ip + new Date().toISOString().slice(0, 10);
  const limit = Number(process.env.CHAT_DAILY_LIMIT) || 15;
  const n = (hits.get(key) || 0) + 1;
  hits.set(key, n);
  if (hits.size > 5000) hits.clear();
  if (n > limit) return NextResponse.json({ error: 'limit' }, { status: 429 });

  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'bad' }, { status: 400 }); }
  const { messages = [], lang = 'vi' } = body;

  const system = lang === 'en'
    ? 'You are a friendly study assistant for students and teachers. Answer briefly and clearly in English.'
    : 'Bạn là trợ lý học tập thân thiện cho học sinh và giáo viên Việt Nam. Trả lời ngắn gọn, dễ hiểu, bằng tiếng Việt.';
  const contents = messages.slice(-8).map((m) => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: String(m.text).slice(0, 800) }],
  }));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL}:generateContent`;
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
    body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents }),
  });
  if (!r.ok) return NextResponse.json({ error: 'upstream' }, { status: 502 });
  const d = await r.json();
  return NextResponse.json({ text: d?.candidates?.[0]?.content?.parts?.[0]?.text || '' });
}
