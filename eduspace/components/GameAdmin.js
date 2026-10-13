'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const blankQ = () => ({ q: '', o: ['', '', '', ''], a: 0 });
const blank = () => ({ title: '', emoji: '', description: '', kind: 'quiz', url: '', questions: [blankQ()] });

// Quản lý trò chơi: thêm, sửa, xóa, đổi thứ tự. Có 2 loại: bộ câu hỏi trắc nghiệm, hoặc liên kết trò chơi bên ngoài
export default function GameAdmin({ onMsg }) {
  const [games, setGames] = useState([]);
  const [f, setF] = useState(blank());
  const [editId, setEditId] = useState(null);

  const load = async () => {
    const { data, error } = await supabase.from('games').select('*').order('position').order('created_at');
    if (error) { onMsg('Chưa có bảng trò chơi: hãy chạy file supabase/migration-3-games.sql trong Supabase (tab SQL).'); return; }
    setGames(data || []);
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const setQ = (i, patch) => setF((p) => ({ ...p, questions: p.questions.map((x, k) => (k === i ? { ...x, ...patch } : x)) }));
  const setOpt = (i, j, v) => setF((p) => ({
    ...p,
    questions: p.questions.map((x, k) => (k === i ? { ...x, o: x.o.map((s, m) => (m === j ? v : s)) } : x)),
  }));

  const cancel = () => { setF(blank()); setEditId(null); };
  const startEdit = (g) => {
    setF({
      title: g.title, emoji: g.emoji || '', description: g.description || '', kind: g.kind, url: g.url || '',
      questions: g.kind === 'quiz' && g.questions?.length
        ? g.questions.map((x) => ({ q: x.q, o: [...x.o, '', '', '', ''].slice(0, 4), a: x.a }))
        : [blankQ()],
    });
    setEditId(g.id); onMsg('');
    window.scrollTo({ top: document.getElementById('game-form')?.offsetTop - 80 || 0, behavior: 'smooth' });
  };

  const save = async () => {
    if (!f.title.trim()) return onMsg('Cần nhập tên trò chơi.');
    let row = { title: f.title.trim(), emoji: f.emoji.trim() || null, description: f.description.trim() || null, kind: f.kind };
    if (f.kind === 'link') {
      if (!/^https?:\/\//.test(f.url.trim())) return onMsg('Liên kết phải bắt đầu bằng http:// hoặc https://');
      row = { ...row, url: f.url.trim(), questions: null };
    } else {
      const qs = [];
      for (const [n, x] of f.questions.entries()) {
        if (!x.q.trim()) continue; // bỏ qua câu để trống
        const opts = x.o.map((s, i) => ({ s: s.trim(), i })).filter((z) => z.s);
        const correct = opts.findIndex((z) => z.i === x.a);
        if (opts.length < 2 || correct < 0) return onMsg(`Câu ${n + 1}: cần ít nhất 2 đáp án, và đáp án đúng không được để trống.`);
        qs.push({ q: x.q.trim(), o: opts.map((z) => z.s), a: correct });
      }
      if (!qs.length) return onMsg('Cần ít nhất 1 câu hỏi.');
      row = { ...row, url: null, questions: qs };
    }
    const maxPos = games.reduce((m, g) => Math.max(m, g.position || 0), 0);
    const { error } = editId
      ? await supabase.from('games').update(row).eq('id', editId)
      : await supabase.from('games').insert({ ...row, position: maxPos + 1 });
    if (error) return onMsg(error.message);
    cancel(); onMsg('Đã lưu trò chơi!'); load();
  };

  const remove = async (g) => {
    if (!window.confirm(`Xóa trò chơi "${g.title}"?`)) return;
    const { error } = await supabase.from('games').delete().eq('id', g.id);
    onMsg(error ? error.message : '');
    if (g.id === editId) cancel();
    load();
  };

  const move = async (i, d) => {
    const j = i + d;
    if (j < 0 || j >= games.length) return;
    const arr = [...games];
    [arr[i], arr[j]] = [arr[j], arr[i]];
    await Promise.all(arr.map((g, k) => (g.position === k + 1 ? null : supabase.from('games').update({ position: k + 1 }).eq('id', g.id))));
    load();
  };

  return (
    <div className="card" style={{ marginTop: 14 }} id="game-form">
      <h3>🎮 {editId ? 'Đang sửa trò chơi' : 'Trò chơi'}</h3>

      <div className="row" style={{ marginBottom: 8 }}>
        <button className={'lgb' + (f.kind === 'quiz' ? ' on' : '')} onClick={() => setF({ ...f, kind: 'quiz' })}>Bộ câu hỏi trắc nghiệm</button>
        <button className={'lgb' + (f.kind === 'link' ? ' on' : '')} onClick={() => setF({ ...f, kind: 'link' })}>Liên kết trò chơi bên ngoài</button>
      </div>

      <input placeholder="Tên trò chơi" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
      <input placeholder="Mô tả ngắn" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
      <input placeholder="Emoji ảnh bìa (tùy chọn), ví dụ 🎯" maxLength={4} value={f.emoji} onChange={(e) => setF({ ...f, emoji: e.target.value })} />

      {f.kind === 'link' ? (
        <>
          <input placeholder="Liên kết trò chơi (Wordwall, Quizizz, Kahoot, Blooket...)" value={f.url} onChange={(e) => setF({ ...f, url: e.target.value })} />
          <p className="meta">Trò chơi sẽ mở ở tab mới khi người xem bấm vào thẻ.</p>
        </>
      ) : (
        <>
          {f.questions.map((x, i) => (
            <div className="qbox" key={i}>
              <div className="row" style={{ marginTop: 0 }}>
                <b>Câu {i + 1}</b>
                <span style={{ flex: 1 }} />
                {f.questions.length > 1 && (
                  <button className="btn alt" onClick={() => setF({ ...f, questions: f.questions.filter((_, k) => k !== i) })}>Xóa câu</button>
                )}
              </div>
              <input placeholder="Nội dung câu hỏi" value={x.q} onChange={(e) => setQ(i, { q: e.target.value })} />
              {x.o.map((s, j) => (
                <div className="row" key={j} style={{ marginTop: 4 }}>
                  <input type="radio" name={`ans-${i}`} title="Đáp án đúng" checked={x.a === j} onChange={() => setQ(i, { a: j })} style={{ width: 'auto' }} />
                  <input placeholder={`Đáp án ${j + 1}${x.a === j ? ' (đúng)' : ''}`} value={s} onChange={(e) => setOpt(i, j, e.target.value)} />
                </div>
              ))}
            </div>
          ))}
          <p className="meta">Chọn nút tròn bên trái đáp án đúng. Có thể để trống đáp án 3, 4 nếu câu chỉ có 2 lựa chọn.</p>
          <button className="btn alt" onClick={() => setF({ ...f, questions: [...f.questions, blankQ()] })}>+ Thêm câu hỏi</button>
        </>
      )}

      <div className="row">
        <button className="btn" onClick={save}>{editId ? 'Lưu thay đổi' : 'Thêm trò chơi'}</button>
        {editId && <button className="btn alt" onClick={cancel}>Hủy sửa</button>}
      </div>

      <h3 style={{ marginTop: 18 }}>📚 Danh sách trò chơi ({games.length})</h3>
      <p className="meta">Trang chủ hiển thị 4 trò chơi đầu tiên. Dùng nút ▲ ▼ để đổi thứ tự.</p>
      {games.map((g, i) => (
        <div className="row" key={g.id}>
          <span style={{ flex: 1 }}>{g.emoji} {g.title} <span className="meta">({g.kind === 'link' ? 'liên kết' : `${g.questions?.length || 0} câu`})</span></span>
          <button className="btn alt" disabled={i === 0} onClick={() => move(i, -1)}>▲</button>
          <button className="btn alt" disabled={i === games.length - 1} onClick={() => move(i, 1)}>▼</button>
          <button className="btn alt" onClick={() => startEdit(g)}>Sửa</button>
          <button className="btn alt" onClick={() => remove(g)}>Xóa</button>
        </div>
      ))}
    </div>
  );
}
