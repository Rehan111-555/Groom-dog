
import "./globals.css";

export const metadata = {
  title: "Dog Groomer",
  description: "Upload a dog photo → AI grooms → compare before/after",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
