import { AppShell, Image, Title, Flex} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './Home.page.module.css';
import Search from '@/components/Search';

export function HomePage() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height:  150}}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Flex
          mih={150}
          bg="#f0f0f0"
          gap="sm"
          justify="center"
          align="center"
          direction="column"
          wrap="wrap"
          >
          <Image
              className={classes.logo}
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Logo_Leonardo.svg/2560px-Logo_Leonardo.svg.png"
          />
          <Title className={classes.title} >Data Quality Framework</Title>
        </Flex>
      </AppShell.Header>

      <AppShell.Navbar 
        p="md"
        bg="#f0f0f0"
        >
        Filters
      </AppShell.Navbar>

      <AppShell.Main>
        <div className={classes.search}>
          <Search/>
        </div>
        





      </AppShell.Main>
    </AppShell>
  );
}


// <ColorSchemeToggle /> per cambiare tema