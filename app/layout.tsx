"use client";
import styles from '@/layout.module.css';
import { AppShell, createTheme, MantineProvider } from "@mantine/core";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "./components/client/Header";
import Navbar from './components/layout/Navbar';
import "./globals.css";
import "@mantine/core/styles.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const myTheme = createTheme({
  defaultRadius: 0,
  fontSmoothing: true,
  fontFamily: "Roboto, sans-serif",
  primaryColor: "gray",
  components: {
    Select: {
      defaultProps: {
        size: "xs",
        labelProps: {
          style: { color: "white" },
        },
      },
    },
    Text: {
      defaultProps: {
        c: "white",
      },
    },
    Title: {
      defaultProps: {
        c: "white",
      }
    }
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <MantineProvider theme={myTheme}>
          <AppShell withBorder={false}>
            <div className={styles.dashboard}>
              <Header />

              <div className={styles.dashboard_layout}>
                <Navbar />

                <div className={styles.dashboard_main}>
                  {children}
                </div>
              </div>
            </div>
          </AppShell>
        </MantineProvider>
      </body>
    </html>
  );
}