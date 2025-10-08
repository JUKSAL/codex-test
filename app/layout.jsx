import "./globals.css";

export const metadata = {
  title: "Calculator",
  description: "Responsive calculator experience built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
