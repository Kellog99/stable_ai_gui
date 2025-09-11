"use client"; // if you need client-side behavior

import {
  AppShell,
  AppShellMain,
  AppShellNavbar,
  Container,
  createTheme,
  MantineProvider,
} from "@mantine/core";
import "@mantine/core/styles.css";
import './HomePage/HomePage.css';
import "./layout.css";

import AppNavbar from "@/components/layout/AppNavbar";

const myTheme = createTheme({
  defaultRadius: 0,
  fontSmoothing: true,
  fontFamily: "Roboto, sans-serif",
  primaryColor: "gray",
  components: {
    Select: {
      defaultProps: {
        size: "xs",
      },
    },
  },
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={myTheme}>
      <AppShell
        navbar={{
          width: 250,
          breakpoint: "sm",
        }}

        withBorder={false}
      >
        <AppShellNavbar
          style={{
            backgroundColor: "transparent",
            border: "none",
            padding: "16px",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(62, 129, 236, 0.2)",
              borderRadius: "12px",
              height: "100%",
              paddingTop: "80px",
            }}
          >
            <AppNavbar />
          </div>
        </AppShellNavbar>

        <Container size="100%" style={{ height: "100%", paddingLeft: "80px", paddingTop:"30px"}}>{children}</Container>
        
      </AppShell>
    </MantineProvider>
  );
}
