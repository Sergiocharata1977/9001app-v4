import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import React, { useState } from 'react';

const SidebarItem = ({ icon, text, path, isActive, hasSubItems, isExpanded, onClick }) => {
    const Icon = Icons[icon] || Icons.HelpCircle;

    return (
        <div
            onClick={onClick}
            className={`flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-md cursor-pointer transition-colors duration-200 ${isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
        >
            <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5" />
                <span>{text}</span>
            </div>
            {hasSubItems && (
                <Icons.ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''
                        }`}
                />
            )}
        </div>
    );
};

const SubMenuItem = ({ text, path, isActive, onClick }) => (
    <div
        onClick={onClick}
        className={`pl-12 pr-4 py-2 text-sm rounded-md cursor-pointer transition-colors duration-200 ${isActive
                ? 'bg-slate-700/50 text-white font-semibold'
                : 'text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
    >
        {text}
    </div>
);

const ListMenu = ({ modules, handleNavigation, isActive }) => {
    const [expandedSections, setExpandedSections] = useState({});

    const toggleSection = (moduleId) => {
        setExpandedSections(prev => ({
            ...prev,
            [moduleId]: !prev[moduleId]
        }));
    };

    return (
        <nav className="flex-1 px-4 py-4 space-y-2">
            {modules.map(module => {
                const isExpanded = expandedSections[module.id] || false;
                return (
                    <div key={module.id}>
                        <SidebarItem
                            icon={module.icon}
                            text={module.name.replace(/^[📊|🏢|👥|⚙️|🎯|📈|💬|📦|👨‍💼|💼|📅].*?\d\.\s/, '')}
                            path={module.path}
                            isActive={isActive(module.path) && !module.items}
                            hasSubItems={!!module.items}
                            isExpanded={isExpanded}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (module.items) {
                                    toggleSection(module.id);
                                } else {
                                    handleNavigation(module.path);
                                }
                            }}
                        />
                        {module.items && isExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mt-1 space-y-1"
                            >
                                {module.items.map(item => (
                                    <SubMenuItem
                                        key={item.path}
                                        text={item.name}
                                        path={item.path}
                                        isActive={isActive(item.path)}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleNavigation(item.path);
                                        }}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </div>
                );
            })}
        </nav>
    );
};

export default ListMenu;
