'use client';
import { useEffect, useRef } from 'react';
import { uploadImage } from '@/lib/upload';
import { sanitize, toHtml } from '@/lib/sanitize';

// Ô soạn thảo: in đậm/nghiêng, tiêu đề, danh sách, căn lề, chèn ảnh
export default function RichEditor({ initial, resetKey, onChange, onError }) {
  const ref = useRef(null);
  const fileRef = useRef(null);
  const saved = useRef(null);

  // Chỉ nạp lại nội dung khi resetKey đổi (mở bài để sửa / làm mới form)
  useEffect(() => {
    if (ref.current) ref.current.innerHTML = sanitize(toHtml(initial));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  const emit = () => onChange(ref.current.innerHTML);
  const saveSel = () => {
    const s = window.getSelection();
    if (s.rangeCount && ref.current.contains(s.anchorNode)) saved.current = s.getRangeAt(0).cloneRange();
  };
  const restoreSel = () => {
    ref.current.focus();
    if (saved.current) {
      const s = window.getSelection();
      s.removeAllRanges();
      s.addRange(saved.current);
    }
  };
  const cmd = (name, val) => {
    ref.current.focus();
    document.execCommand(name, false, val);
    emit();
    saveSel();
  };

  const pickImage = async (e) => {
    const f = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!f) return;
    try {
      onError && onError('Đang tải ảnh...');
      const url = await uploadImage(f);
      restoreSel();
      document.execCommand('insertImage', false, url);
      emit();
      onError && onError('');
    } catch (err) {
      onError && onError(err.message);
    }
  };

  const B = ({ c, v, label, title }) => (
    <button type="button" title={title} onMouseDown={(e) => e.preventDefault()} onClick={() => cmd(c, v)}>
      {label}
    </button>
  );

  return (
    <div>
      <div className="tb">
        <B c="bold" label={<b>B</b>} title="In đậm" />
        <B c="italic" label={<i>I</i>} title="In nghiêng" />
        <B c="underline" label={<u>U</u>} title="Gạch chân" />
        <B c="formatBlock" v="h2" label="Tiêu đề" title="Tiêu đề lớn" />
        <B c="formatBlock" v="p" label="Văn bản" title="Đoạn văn thường" />
        <B c="insertUnorderedList" label="• Danh sách" title="Danh sách gạch đầu dòng" />
        <span className="sep" />
        <B c="justifyLeft" label="⬅ Trái" title="Căn trái" />
        <B c="justifyCenter" label="↔ Giữa" title="Căn giữa (dùng cho cả ảnh)" />
        <B c="justifyRight" label="Phải ➡" title="Căn phải" />
        <B c="justifyFull" label="☰ Đều" title="Căn đều hai bên" />
        <span className="sep" />
        <button type="button" title="Chèn ảnh vào vị trí con trỏ" onMouseDown={(e) => { e.preventDefault(); saveSel(); }} onClick={() => fileRef.current.click()}>
          🖼 Chèn ảnh
        </button>
        <B c="undo" label="↶" title="Hoàn tác" />
        <B c="redo" label="↷" title="Làm lại" />
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={pickImage} />
      </div>
      <div
        ref={ref}
        className="ed rich"
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onKeyUp={saveSel}
        onMouseUp={saveSel}
        onBlur={saveSel}
        onPaste={(e) => {
          e.preventDefault();
          document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
        }}
      />
    </div>
  );
}
