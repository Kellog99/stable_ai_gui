"use client";
import AppNavbar from "@/components/layout/AppNavbar";
import useStore from "@/store/dsStore";
import
{
  AppShell,
  Container,
  MantineProvider, 
} from "@mantine/core";
import "@mantine/core/styles.css";
import classes from "./layout.module.css";


export default function RootLayout ( { children }: { children: React.ReactNode } )
{
  const collapsed = useStore( ( state ) => state.collapsed );

  return (
    <MantineProvider >
      <AppShell withBorder={ false }>
        <Container
          size="100%"
          className={`${classes.mainContainer} ${collapsed ? classes.collapsed : ""}`}
        >
          <div className={ `${classes.customNavbar} ${collapsed ? classes.collapsed : ""}` }>
            <div className={ classes.navbarContent }>
              <AppNavbar />
            </div>
          </div>
          { children }
        </Container>
      </AppShell>
    </MantineProvider>
  );
}