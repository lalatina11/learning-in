import { PageProps } from '@/types/page-props';
import { usePage } from '@inertiajs/react';
import { ReactNode } from 'react';
import DashboardAppSidebar from '../dashboard-app-sidebar';
import SideBarHeader from '../headers/sidebar-header';
import { SidebarProvider } from '../ui/sidebar';
import ToasterProviderContainer from './toaster-provider-container';

interface Props {
    children: ReactNode;
}

const DashboardPageContainer = ({ children }: Props) => {
    const { sidebar_state } = usePage().props as PageProps;

    const defaultOpenSidebar = sidebar_state && sidebar_state === 'true' ? true : false;

    return (
        <ToasterProviderContainer>
            <SidebarProvider defaultOpen={defaultOpenSidebar}>
                <DashboardAppSidebar />
                <div className="w-full">
                    <SideBarHeader />
                    {children}
                </div>
            </SidebarProvider>
        </ToasterProviderContainer>
    );
};

export default DashboardPageContainer;
