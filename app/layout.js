import '../styles/globals.css';
import NextAuthSessionProvider from '../components/SessionProvider';
import AlienCursor from '../components/AlienCursor';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NextAuthSessionProvider>
          <AlienCursor />
          {children}
        </NextAuthSessionProvider>
      </body>
    </html>
  );
} 