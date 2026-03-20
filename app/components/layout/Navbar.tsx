"use client"
import './Navbar.css';
import { NavigationSection, sections } from './config';
import NavigationButton from './NavigationButton';
import { Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Profile from './Profile';

export default function Navbar() {
    const [opened, { toggle }] = useDisclosure(true);


    return (
        <div className='container-nav'>
            <div className='nav-header'>
                <Burger
                    size={20}
                    color='white'
                    opened={opened}
                    onClick={toggle}
                />
                {opened ?
                    "Menu" : null}
            </div>
            <div className="nav-section">
                {Object.entries(sections).map(
                    ([sectionName, elements]: [string, NavigationSection[]]) => (
                        <div key={sectionName}>
                            <h3 className="section-title">{sectionName}</h3>
                            <div className="nav-items">
                                {elements.map((element) => (
                                    <NavigationButton
                                        id={element.id}
                                        title={element.title}
                                        href={element.href}
                                        Icon={element.Icon}
                                        items={element.items}
                                        requiresEmbeddings={false}
                                        isDisabled={false}
                                        isClosed={!opened} />
                                ))}
                            </div>
                        </div>
                    ))}
            </div>
            <Profile isOpen={opened} />
        </div>
    );
}
