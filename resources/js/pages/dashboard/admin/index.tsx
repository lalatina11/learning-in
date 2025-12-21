import DashboardPageContainer from '@/components/containers/dashboard-page-container';

const AdminDashboardIndexPage = (props: any) => {
    return (
        <DashboardPageContainer>
            <div className="flex h-full w-full items-center justify-center">
                <span>Hello, selamat datang di admin dashboard!</span>
            </div>
        </DashboardPageContainer>
    );
};

export default AdminDashboardIndexPage;
