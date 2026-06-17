import type { Metadata } from "next";
import { Poppins, Open_Sans } from "next/font/google";
import { AuthProvider } from "@/components/admin/auth-provider";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-opensans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VanhCorp - Chuyển đổi AI cho doanh nghiệp SME",
  description: "Hệ thống CRM thông minh với AI-powered insights cho đội ngũ sales",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${poppins.variable} ${openSans.variable}`}>
      <body className="antialiased font-opensans">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
