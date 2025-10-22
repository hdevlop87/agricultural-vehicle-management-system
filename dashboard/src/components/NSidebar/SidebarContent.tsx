import React from 'react'
import { SidebarItem } from './SidebarItem';
import { useTranslation } from '@/hooks/useLanguage';
import { RoleGuard } from '../NGuard/RoleGuard';

type ContentProps = {
    isExpanded: boolean;
}

const SidebarContent: React.FC<ContentProps> = ({ isExpanded }) => {
    const { t } = useTranslation();

    const sidebarItems = [
        {
            name: t('navigation.dashboard'),
            icon: 'dashboard',
            path: '/',
            minRole: 'operator'
        },
        {
            name: t('navigation.map'),
            icon: 'map',
            path: '/map',
            minRole: 'operator'
        },
        {
            name: t('navigation.fields'),
            icon: 'fields',
            path: '/fields',
            minRole: 'operator'
        },
        {
            name: t('navigation.vehicles'),
            icon: 'vehicles',
            path: '/vehicles',
            minRole: 'operator'
        },
        {
            name: t('navigation.operations'),
            icon: 'operations',
            path: '/operations',
            minRole: 'operator'
        },
        {
            name: t('navigation.operators'),
            icon: 'operators',
            path: '/operators',
            adminOnly: true
        },
        {
            name: t('navigation.refuel'),
            icon: 'refuel',
            path: '/refuel',
            minRole: 'operator'
        },
        {
            name: t('navigation.maintenance'),
            icon: 'maintenance',
            path: '/maintenance',
            adminOnly: true
        },
        {
            name: t('navigation.alerts'),
            icon: 'alert',
            path: '/alerts',
            adminOnly: true
        },
        {
            name: t('navigation.trackers'),
            icon: 'tracker',
            path: '/trackers',
            adminOnly: true
        },
        {
            name: t('navigation.users'),
            icon: 'users',
            path: '/users',
            adminOnly: true
        },
        {
            name: t('navigation.roles'),
            icon: 'fingerPrint',
            path: '/roles',
            adminOnly: true
        },

    ];

    return (
        <div className='flex flex-col gap-2'>
            {sidebarItems.map(item => (
                <RoleGuard
                    key={item.path}
                    minRole={item.minRole}
                    adminOnly={item.adminOnly}
                >
                    <SidebarItem
                        name={item.name}
                        icon={item.icon}
                        path={item.path}
                        isExpanded={isExpanded}
                    />
                </RoleGuard>
            ))}
        </div>
    )
}

export default SidebarContent