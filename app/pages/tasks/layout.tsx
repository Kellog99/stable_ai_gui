"use client";
import Navbar from "@/components/layout/Navbar";
import useStore from "@/store/dsStore";
import {
  AppShell,
  MantineProvider,
} from "@mantine/core";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const collapsed = useStore((state) => state.collapsed);

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