"use client";
import { Inter, Poppins } from "next/font/google";
import './globals.css';

// ** Store Imports
import { store } from '../store';
import { Provider } from 'react-redux';

// ** Component Imports
import Spinner from "../components/spinner";
import AuthGuard from "../components/auth/AuthGuard";

// ** Contexts
import { AuthProvider } from "../context/AuthContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${inter.variable}`}>
        <Provider store={store}>
          <AuthProvider >
            <AuthGuard fallback={<Spinner />}>
              {children}
            </AuthGuard>
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}
