import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { SidebarMenuNavigationItem, User as UserType } from '@/types';
import { PageProps } from '@/types/page-props';
import { Link, usePage } from '@inertiajs/react';
import { ChevronUp, LayoutDashboard, School, User, User2 } from 'lucide-react';
import LogOutForm from './forms/logout-form';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

const getSidebarMenuByUserRole = (role: UserType['role']) => {
    if (role === 'ADMIN') {
        return [
            {
                title: 'Dashboard',
                url: '/dashboard/admin',
                icon: LayoutDashboard,
            },
            {
                title: 'Kelola Pengguna',
                url: '/dashboard/admin/user',
                icon: User,
            },
            {
                title: 'Kelola Sekolah',
                url: '/dashboard/admin/school',
                icon: School,
            },
        ] satisfies Array<SidebarMenuNavigationItem>;
    }
    if (role === 'TEACHER') {
        return [{ title: 'Dashboard', icon: LayoutDashboard, url: '/dashboard/teacher' }] satisfies Array<SidebarMenuNavigationItem>;
    }
    return [{ title: 'Dashboard', icon: LayoutDashboard, url: '/dashboard' }] satisfies Array<SidebarMenuNavigationItem>;
};

const DashboardAppSidebar = () => {
    const {
        auth: { user },
    } = usePage().props as PageProps;

    const items = getSidebarMenuByUserRole(user?.role as UserType['role']);

    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Dashboard Menu</SidebarGroupLabel>
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
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <User2 /> {user?.name}
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="right" className="w-[--radix-popper-anchor-width]">
                                <DropdownMenuItem>
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>Billing</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="flex w-full">
                                    <LogOutForm />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
};

export default DashboardAppSidebar;
