import
{
    AppShell,
    AppShellMain,
    AppShellNavbar,
    ColorSchemeScript,
    Container,
    createTheme,
    mantineHtmlProps,
    MantineProvider,
    ScrollArea
} from "@mantine/core";
import "@mantine/core/styles.css";
import './HomePage/HomePage.css';

import AppNavbar from "@/components/layout/AppNavbar";

const myTheme = createTheme( {
    defaultRadius: 0,
    fontSmoothing: true,
    fontFamily: 'Roboto, sans-serif',
    primaryColor: 'dark',
    components: {
        Select: {
            defaultProps: {
                size: "xs"
            }
        }
    }

} )


export default async function RootLayout ( { children }: { children: any } )
{

    return (
        <html lang="en" { ...mantineHtmlProps }>
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
                <MantineProvider theme={ myTheme }>
                    <div className="home-page">
                        <AppShell
                            header={ { height: 60 } }
                            navbar={ {
                                width: 250,
                                breakpoint: 'sm',
                                //collapsed: { mobile: !opened },
                            } }
                            padding="md"
                            withBorder={ false }
                        >


                            <AppShellNavbar
                                bg="rgb(62, 129, 236, 0.2)"
                            >

                                <AppNavbar />


                            </AppShellNavbar>

                            <AppShellMain style={ { height: "calc(100vh - 60px)", overflow: "hidden" } } >
                                <ScrollArea style={ { height: "100%" } }>
                                    <Container size="100%">
                                        { children }
                                    </Container>
                                </ScrollArea>

                            </AppShellMain>
                        </AppShell>
                    </div>
                </MantineProvider>
            </body>
        </html>
    );
}
