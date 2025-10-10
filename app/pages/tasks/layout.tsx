"use client";
import Navbar from "@/components/layout/Navbar";
import useStore from "@/store/dsStore";
import {
  AppShell,
  Container,
  MantineProvider,
} from "@mantine/core";
import "@mantine/core/styles.css";

import classes from "@/layout.module.css";


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
          <Container
            size="100%"
            className={classes.mainContainer}
          >
            {children}
          </Container>
        </div>
      </AppShell>
    </MantineProvider >
  );
}