import UserTable from '@/components/admin-components/user-table';
import DashboardPageContainer from '@/components/containers/dashboard-page-container';
import CreateOrUpdateUserForm from '@/components/forms/create-or-upadte-user-form';
import { User as Usertype } from '@/types';
import { User } from 'lucide-react';

interface Props {
    users: Array<Usertype>;
}

const AdminUserManagementDashboard = ({ users }: Props) => {
    console.log(users);

    return (
        <DashboardPageContainer>
            <main className="flex h-full flex-col gap-10 p-6">
                <section>
                    <CreateOrUpdateUserForm />
                </section>
                <section className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <User />
                        <h1>Data Siswa</h1>
                    </div>
                    <UserTable users={users.filter((user) => user.role !== 'TEACHER')} />
                </section>

                <section className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <User />
                        <h1>Data Guru</h1>
                    </div>
                    <UserTable users={users.filter((user) => user.role !== 'STUDENT')} />
                </section>
            </main>
        </DashboardPageContainer>
    );
};

export default AdminUserManagementDashboard;
