"use client";
import AppNavbar from "@/components/layout/AppNavbar";
import useStore from "@/store/dsStore";
import
{
  AppShell,
  Container,
  createTheme,
  MantineProvider
} from "@mantine/core";
import "@mantine/core/styles.css";
import classes from "./layout.module.css";

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
    Text: {
      defaultProps: {
        c: "white", // Mantine uses "c" for color
      },
    },
    Title:{
      defaultProps: {
        c: "white",
      }
    }
  },
});

export default function RootLayout ( { children }: { children: React.ReactNode } )
{
  const collapsed = useStore( ( state ) => state.collapsed );

  return (
    <MantineProvider theme={ myTheme }>
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