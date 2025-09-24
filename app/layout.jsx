import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'Dog Groomer',
  description: 'Upload a dog photo → AI grooms the dog → compare before & after',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
