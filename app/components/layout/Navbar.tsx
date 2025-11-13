import { Shield, Menu, X, BarChart3, PieChart, TrendingUp, Activity, AlertCircle, FileCheck, FileText, UserRound } from 'lucide-react';
import './Navbar.css';
import { sections } from './config';
import NavigationButton from './NavigationButton';
import { useState } from 'react';
import { Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export default function Navbar() {
    const collapsed = false
    const [activeLink, setActiveLink] = useState<string>("")
    const [opened, { toggle }] = useDisclosure(true);
    console.log("open?=", opened)
    return (
        <div className='container-nav'
            style={{ width: `${opened ? "300px" : "140px"}` }}>
            <div className='nav-header'>
                <Burger size={20} color='white' opened={opened} onClick={toggle} />
                {opened ?
                    "Menu" : null}
            </div>
            <div className="nav-section">
                {Object.entries(sections).map(([sectionName, elements]) => (
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
                                    setActiveLink={setActiveLink}
                                    requiresEmbeddings={false}
                                    isDisabled={false}
                                    isClosed={!opened} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className='nav-profile'>
                <UserRound size={"var(--icon-size)"} />
                {opened ?
                    "User Info" : null}
            </div>
        </div>
    );
}
