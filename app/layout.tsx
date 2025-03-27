import "@mantine/core/styles.css";
import Link from 'next/link'
import React from "react";
import {
  MantineProvider,
  ColorSchemeScript,
  mantineHtmlProps,
  createTheme,
  AppShell, AppShellHeader, AppShellNavbar, AppShellMain, ScrollArea,
  Container
} from "@mantine/core";

import classes from './page.module.css';
import AppNavbar from './components/client/AppNavbar';

import { theme } from "../theme";
import AppHeader from "@/components/client/AppHeader"

const myTheme = createTheme({
  defaultRadius: 0,
  fontSmoothing: true,
  fontFamily: 'Roboto, sans-serif',
  primaryColor: 'dark'
})


export default function RootLayout({ children }: { children: any }) {

  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <title />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <title>Data Quality Framework</title>
      </head>
      <body>
        <MantineProvider theme={myTheme}>

          <AppShell
            header={{ height: 60 }}
            navbar={{
              width: 60,
              breakpoint: 'sm',
              //collapsed: { mobile: !opened },
            }}
            padding="md"
            withBorder={true}
          >
            <AppShellHeader p="md" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <AppHeader />
            </AppShellHeader>

            <AppShellNavbar
              p="md"
              bg="#f0f0f0"
            >
              <AppNavbar />

            </AppShellNavbar>

            <AppShellMain style={{ height: "calc(100vh-60px)", overflow: "hidden" }} >
              <ScrollArea style={{ height: "100%" }}>
                <Container size="100%">
                  {children}
                </Container>
              </ScrollArea>

            </AppShellMain>
          </AppShell>

        </MantineProvider>
      </body>
    </html>
  );
}
