import "./globals.css";
import Providers from "./providers";
import Link from "next/link";

export const metadata = {
  title: "Order Management System",
  description: "multi store order management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <header className="border-b bg-white">
            <nav className="max-w-5xl mx-auto flex gap-6 px-4 py-3 text-sm font-medium">
              <Link href="/orders" className="hover:text-blue-600">Orders</Link>
              <Link href="/orders/create" className="hover:text-blue-600">Create Order</Link>
            </nav>
          </header>
          <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
