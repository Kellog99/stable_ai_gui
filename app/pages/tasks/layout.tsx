"use client";
import Navbar from "@/components/layout/Navbar";
import {
  AppShell,
  MantineProvider,
} from "@mantine/core";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  // This represent the Layout for the tasks' pages
  return (
    <MantineProvider >
      <AppShell withBorder={false}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '3vw',
          height: '100%',
          paddingTop: '20px'
        }}>
          <Navbar />
          {children}
        </div>
      </AppShell>
    </MantineProvider >
  );
}