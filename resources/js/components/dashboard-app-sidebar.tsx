import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { User as UserType } from '@/types';
import { PageProps } from '@/types/page-props';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, School, User } from 'lucide-react';

const getSidebarMenuByUserRole = (role: UserType['role']) => {
    if (role === 'ADMIN') {
        return [
            {
                title: 'Dashboard',
                url: '/dashboard/admin',
                icon: LayoutDashboard,
            },
            {
                title: 'User Management',
                url: '/dashboard/admin/user',
                icon: User,
            },
            {
                title: 'Class Management',
                url: '/dashboard/admin/class',
                icon: School,
            },
        ];
    }
    return [];
};

const DashboardAppSidebar = () => {
    const {
        auth: { user },
    } = usePage().props as PageProps;

    const items = getSidebarMenuByUserRole(user?.role as UserType['role']);

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
};

export default DashboardAppSidebar;
