'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const T = {
  vi: {
    home: 'Trang chủ', posts: 'Bài viết', videos: 'Video', games: 'Trò chơi', chat: 'Chatbot',
    heroTitle: 'Học mà chơi, chơi mà học',
    heroText: 'Kho bài viết, video bài giảng, trò chơi tương tác và trợ lý AI luôn sẵn sàng đồng hành cùng thầy cô và học sinh. Hoàn toàn miễn phí, vào là dùng ngay.',
    playNow: 'Chơi thử ngay', askBot: 'Hỏi chatbot', visits: 'Lượt truy cập',
    featPosts: '📝 Bài viết tiêu biểu', featVideos: '🎬 Video nổi bật', featGames: '🎮 Trò chơi',
    more: 'Xem thêm →', openVideo: 'Mở video ↗', empty: 'Chưa có nội dung.',
    chooseGame: 'Chọn một trò chơi để bắt đầu.', back: '← Chọn trò khác', again: 'Chơi lại', question: 'Câu', score: 'Điểm',
    hello: 'Xin chào! Mình là trợ lý EduSpace 🤖 Bạn có thể hỏi mình về bài viết, video, trò chơi hoặc bài học.', send: 'Gửi', typeQ: 'Nhập câu hỏi...',
    thinking: 'Đang suy nghĩ...', askAssistant: 'Hỏi trợ lý', chatTitle: 'Trợ lý EduSpace', chatSub: 'Hỏi về bài viết, video và trò chơi', assistant: 'Trợ lý', close: 'Đóng', listen: 'Nghe đọc', askPh: 'Hỏi về bài học...', chatNote: 'Câu hỏi của bạn được gửi tới một dịch vụ AI để trả lời. Bạn đừng nhập thông tin cá nhân nhé.', sug4: 'Bài viết mới nhất là gì?', sug5: 'Video nào đáng xem?', sug1: 'Website có những bài viết nào?', sug2: 'Có những trò chơi nào?', sug3: 'Kênh YouTube và TikTok của EduSpace?', limitMsg: 'Hôm nay bạn đã hỏi đủ số câu cho phép, hãy quay lại vào ngày mai nhé!',
    errMsg: 'Chatbot đang bận, vui lòng thử lại sau.',
    footDesc: 'Không gian học tập qua trò chơi, bài viết và video, miễn phí cho thầy cô và học sinh.',
    follow: 'Kết nối', links: 'Liên kết', language: 'Ngôn ngữ', rights: '© 2026 EduSpace. Bảo lưu mọi quyền.',
    about: 'Về chúng tôi', terms: 'Điều khoản & Đạo đức số',
    aboutText: 'EduSpace ra đời với mong muốn mang đến một không gian học tập vui vẻ, miễn phí và dễ tiếp cận cho thầy cô và học sinh. Chúng tôi chia sẻ bài viết, tuyển chọn video bài giảng, cung cấp trò chơi tương tác và trợ lý AI hỗ trợ học tập.',
    termsList: [
      'Trang miễn phí, dùng cho mục đích học tập và giảng dạy; không sao chép thương mại khi chưa được phép.',
      'Tôn trọng người khác, không xúc phạm hay bắt nạt trên mạng.',
      'Không chia sẻ thông tin sai lệch hoặc nội dung không phù hợp lứa tuổi học sinh.',
      'Tôn trọng bản quyền, ghi rõ nguồn khi trích dẫn.',
      'Bảo vệ thông tin cá nhân của bản thân và người khác.',
      'Dùng trợ lý AI có trách nhiệm: luôn kiểm tra lại thông tin quan trọng.',
      'Quyền riêng tư: chúng tôi không yêu cầu đăng ký và không thu thập thông tin cá nhân của người xem; lượt truy cập chỉ được đếm ẩn danh.',
      'Chatbot: câu hỏi bạn nhập được gửi tới một dịch vụ AI bên thứ ba để tạo câu trả lời; vui lòng không nhập thông tin cá nhân hoặc thông tin nhạy cảm.'],
    adminTitle: 'Quản trị', email: 'Email', password: 'Mật khẩu', login: 'Đăng nhập', logout: 'Đăng xuất',
    titleLbl: 'Tiêu đề', contentLbl: 'Nội dung', emojiLbl: 'Emoji ảnh bìa (tùy chọn)', urlLbl: 'Liên kết video',
    publish: 'Đăng bài', addVideo: 'Thêm video', del: 'Xóa',
    save: 'Lưu thay đổi', cancel: 'Hủy sửa', edit: 'Sửa', view: 'Xem', noGames: 'Chưa có trò chơi.', openGame: 'Mở trò chơi ↗', saved: 'Đã lưu!', coverLbl: 'Ảnh bìa', uploadCover: '📷 Tải ảnh bìa', removeCover: 'Gỡ ảnh bìa', confirmDel: 'Bạn chắc chắn muốn xóa mục này?', backList: '← Quay lại', notFound: 'Không tìm thấy bài viết.', editing: 'Đang sửa bài viết',
  },
  en: {
    home: 'Home', posts: 'Articles', videos: 'Videos', games: 'Games', chat: 'Chatbot',
    heroTitle: 'Learn by playing, play to learn',
    heroText: 'Articles, lecture videos, interactive games and an AI assistant, always ready to support teachers and students. Completely free, just jump in.',
    playNow: 'Play now', askBot: 'Ask the chatbot', visits: 'Visits',
    featPosts: '📝 Featured articles', featVideos: '🎬 Featured videos', featGames: '🎮 Games',
    more: 'See more →', openVideo: 'Open video ↗', empty: 'Nothing here yet.',
    chooseGame: 'Pick a game to start.', back: '← Choose another game', again: 'Play again', question: 'Question', score: 'Score',
    hello: 'Hello! I am the EduSpace assistant 🤖 You can ask me about articles, videos, games or lessons.', send: 'Send', typeQ: 'Type your question...',
    thinking: 'Thinking...', askAssistant: 'Ask the assistant', chatTitle: 'EduSpace Assistant', chatSub: 'Ask about articles, videos and games', assistant: 'Assistant', close: 'Close', listen: 'Listen', askPh: 'Ask about the lessons...', chatNote: 'Your question is sent to an AI service to be answered. Please do not enter personal information.', sug4: 'What is the latest article?', sug5: 'Which videos are worth watching?', sug1: 'What articles are on the website?', sug2: 'What games are there?', sug3: 'What are EduSpace\'s YouTube and TikTok channels?', limitMsg: 'You have reached today\'s question limit. Please come back tomorrow!',
    errMsg: 'The chatbot is busy, please try again later.',
    footDesc: 'A free space for learning through games, articles and videos, made for teachers and students.',
    follow: 'Follow us', links: 'Links', language: 'Language', rights: '© 2026 EduSpace. All rights reserved.',
    about: 'About us', terms: 'Terms & Digital Ethics',
    aboutText: 'EduSpace was created to offer a fun, free and accessible learning space for teachers and students. We share articles, curate lecture videos, and provide interactive games and an AI study assistant.',
    termsList: [
      'The site is free and intended for learning and teaching; do not copy it for commercial use without permission.',
      'Respect others; no insults or cyberbullying.',
      'Do not share false information or content unsuitable for students.',
      'Respect copyright and credit your sources.',
      'Protect your own and other people\'s personal information.',
      'Use the AI assistant responsibly: always double-check important information.',
      'Privacy: no registration is required and no personal information is collected from visitors; visits are counted anonymously.',
      'Chatbot: the questions you type are sent to a third-party AI service to generate answers; please do not enter personal or sensitive information.'],
    adminTitle: 'Admin', email: 'Email', password: 'Password', login: 'Log in', logout: 'Log out',
    titleLbl: 'Title', contentLbl: 'Content', emojiLbl: 'Cover emoji (optional)', urlLbl: 'Video link',
    publish: 'Publish', addVideo: 'Add video', del: 'Delete',
    save: 'Save changes', cancel: 'Cancel edit', edit: 'Edit', view: 'View', noGames: 'No games yet.', openGame: 'Open game ↗', saved: 'Saved!', coverLbl: 'Cover image', uploadCover: '📷 Upload cover', removeCover: 'Remove cover', confirmDel: 'Are you sure you want to delete this?', backList: '← Back', notFound: 'Article not found.', editing: 'Editing article',
  },
};

const Ctx = createContext({ lang: 'vi', t: (k) => k, setLang: () => {} });

export function LangProvider({ children }) {
  const [lang, setL] = useState('vi');
  useEffect(() => {
    const s = localStorage.getItem('lang');
    if (s === 'en' || s === 'vi') setL(s);
  }, []);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const setLang = (l) => { setL(l); localStorage.setItem('lang', l); };
  const t = (k) => T[lang][k] ?? k;
  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}
export const useLang = () => useContext(Ctx);
