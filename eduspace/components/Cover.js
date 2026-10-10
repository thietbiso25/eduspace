const PAL = [['#ff5a5f', '#ff8a3d'], ['#ff8a3d', '#f59e0b'], ['#ec4899', '#ff5a5f'], ['#14b8a6', '#22c55e'], ['#6366f1', '#0ea5e9']];
const EM = ['📚', '🧠', '🎯', '🌟', '✏️', '🔬', '🎨', '🧮'];

export default function Cover({ title = '', emoji, tag, play }) {
  let h = 0;
  for (const c of title) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const p = PAL[h % PAL.length];
  return (
    <div className="thumb" style={{ background: `linear-gradient(135deg,${p[0]},${p[1]})` }}>
      <span className="tag">{tag}</span>
      <span className="em">{emoji || EM[h % EM.length]}</span>
      {play && <span className="pl">▶</span>}
    </div>
  );
}
