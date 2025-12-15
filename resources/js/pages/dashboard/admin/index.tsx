import DashboardPageContainer from '@/components/containers/dashboard-page-container';

const AdminDashboardIndexPage = (props: any) => {
    return (
        <DashboardPageContainer>
            <main className="flex h-full w-full items-center justify-center">
                <span>Hello, selamat datang di admin dashboard!</span>
            </main>
        </DashboardPageContainer>
    );
};

export default AdminDashboardIndexPage;
