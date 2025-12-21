import UserTable from '@/components/admin-components/user-table';
import DashboardPageContainer from '@/components/containers/dashboard-page-container';
import CreateOrUpdateUserForm from '@/components/forms/create-or-update-user-form';
import { User as Usertype } from '@/types';
import { User } from 'lucide-react';

interface Props {
    users: Array<Usertype>;
}

const AdminUserManagementDashboard = ({ users }: Props) => {
    const usersItem = [
        { title: 'Data Guru', users: users.filter((user) => user.role !== 'TEACHER') },
        { title: 'Data Siswa', users: users.filter((user) => user.role !== 'STUDENT') },
    ];

    return (
        <DashboardPageContainer>
            <section>
                <CreateOrUpdateUserForm />
            </section>
            {usersItem.map((item) => (
                <section key={item.title} className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <User />
                        <h1>Data Siswa</h1>
                    </div>
                    <UserTable users={item.users} />
                </section>
            ))}
        </DashboardPageContainer>
    );
};

export default AdminUserManagementDashboard;
