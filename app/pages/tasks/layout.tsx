"use client";
import Navbar from "@/components/layout/Navbar";
import {
  AppShell,
  MantineProvider,
} from "@mantine/core";

import classes from "@/layout.module.css";


export default function RootLayout({ children }: { children: React.ReactNode }) {

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