'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

const explain = (s) =>
  s === 200 ? '✅ Hoạt động tốt'
  : s === 401 || s === 403 ? '❌ Google từ chối khóa (sai khóa, khóa chưa bật quyền, hoặc loại khóa chưa được hỗ trợ)'
  : s === 404 ? '❌ Tên model không dùng được'
  : s === 429 ? '⚠️ Hết hạn mức, hoặc tài khoản chưa có hạn mức miễn phí cho model này'
  : s === 400 ? '❌ Yêu cầu hoặc khóa không hợp lệ'
  : s === 0 ? '❌ Không kết nối được tới Google'
  : `❌ Lỗi mã ${s}`;

// Nút kiểm tra chatbot dành cho quản trị viên
export default function ChatCheck() {
  const [res, setRes] = useState(null);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true); setRes(null);
    try {
      const { data } = await supabase.auth.getSession();
      const r = await fetch('/api/chat/test', {
        method: 'POST',
        headers: { Authorization: `Bearer ${data.session?.access_token || ''}` },
      });
      if (r.status === 404) setRes({ error: 'Web chưa có tính năng kiểm tra này: mã mới chưa lên GitHub hoặc Vercel chưa triển khai xong.' });
      else if (!r.ok) setRes({ error: `Không kiểm tra được (mã ${r.status}). Hãy đăng xuất và đăng nhập lại.` });
      else setRes(await r.json());
    } catch (e) {
      setRes({ error: 'Không kết nối được tới máy chủ.' });
    }
    setBusy(false);
  };

  return (
    <div className="card" style={{ marginTop: 14 }}>
      <h3>🩺 Kiểm tra chatbot</h3>
      <p className="meta">Bấm để thử gọi Google bằng khóa đã cài trên Vercel và xem kết quả từng model.</p>
      <button className="btn" onClick={run} disabled={busy}>{busy ? 'Đang kiểm tra...' : 'Kiểm tra ngay'}</button>
      {res && res.error && <p>{res.error}</p>}
      {res && !res.error && (
        <div style={{ marginTop: 10 }}>
          <p>
            Khóa GEMINI_API_KEY: {res.hasKey ? `đã có (bắt đầu bằng "${res.keyStart}", dài ${res.keyLength} ký tự)` : '❌ CHƯA CÓ (chưa thêm, hoặc chưa Redeploy)'}
            <br />GEMINI_MODEL: {res.envModel || '(chưa đặt, dùng mặc định)'}
          </p>
          {res.models.map((m) => (
            <div className="qbox" key={m.model}>
              <b>{m.model}</b>: {explain(m.status)} <span className="meta">(mã {m.status})</span>
              {m.detail && <div className="meta" style={{ wordBreak: 'break-word' }}>{m.detail}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
