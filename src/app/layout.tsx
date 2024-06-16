"use client";
import './globals.css';

// ** Store Imports
import { store } from '../store';
import { Provider } from 'react-redux';

// ** Component Imports
import Spinner from "../components/spinner";
import AuthGuard from "../components/auth/AuthGuard";

// ** Contexts
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body >
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
