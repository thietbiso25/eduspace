import './globals.css';
import { LangProvider } from '@/lib/i18n';
import Shell from '@/components/Shell';

export const metadata = {
  title: 'EduSpace',
  description: 'Học mà chơi, chơi mà học — bài viết, video, trò chơi và trợ lý AI miễn phí.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap" rel="stylesheet" />
      </head>
      <body>
        <LangProvider><Shell>{children}</Shell></LangProvider>
      </body>
    </html>
  );
}
