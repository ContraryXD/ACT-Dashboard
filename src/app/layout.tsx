import Sidebar from "@/components/Sidebar";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex">
        {" "}
        {/* Use flexbox to arrange children horizontally */}
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {" "}
          {/* Main content area that takes remaining space and scrolls if needed */}
          {children}
        </main>
      </body>
    </html>
  );
}
