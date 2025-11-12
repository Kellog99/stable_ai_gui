import { Shield, Menu, X, BarChart3, PieChart, TrendingUp, Activity, AlertCircle, FileCheck, FileText } from 'lucide-react';
import './Navbar.css';
import { sections } from './config';
import NavigationButton from './NavigationButton';
import { useState } from 'react';

export default function Navbar() {
    const collapsed = false
    const [activeLink, setActiveLink] = useState<string>("")

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                {!collapsed && (
                    <div className="sidebar-brand">
                        <div className="brand-icon">
                            <Shield size={18} className="text-white" />
                        </div>
                        <span className="brand-name">TrusthWorty</span>
                    </div>
                )}
                <button className="sidebar-toggle">
                    {collapsed ? <Menu size={20} /> : <X size={20} />}
                </button>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-section">
                    {!collapsed ? (
                        Object.entries(sections).map(([sectionName, elements]) => (
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
                                            isClosed={false} />
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : null}
                </div>
            </nav>
        </aside>
    );
}
