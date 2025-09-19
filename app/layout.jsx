import "./globals.css";

export const metadata = {
  title: "Dog Groomer",
  description: "Upload a dog photo → AI grooms the dog → compare before & after",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Helpful base classes for crisp text + full-height background */}
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
