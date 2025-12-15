import { switchUserRoleToCapitalize } from '@/lib/switch-cases';
import { User } from '@/types';
import { PageProps } from '@/types/page-props';
import { usePage } from '@inertiajs/react';
import { SidebarTrigger, useSidebar } from '../ui/sidebar';

const SideBarHeader = () => {
    const {
        auth: { user },
    } = usePage().props as PageProps;

    const { toggleSidebar } = useSidebar();

    return (
        <header className="flex w-full items-center gap-2 bg-card p-4">
            <SidebarTrigger onClick={toggleSidebar} />
            <span className="text-sm">{switchUserRoleToCapitalize(user?.role as User['role'])} Dashboard</span>
        </header>
    );
};

export default SideBarHeader;
