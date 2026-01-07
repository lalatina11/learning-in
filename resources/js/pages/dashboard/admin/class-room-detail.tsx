import StudentTable from '@/components/admin-components/student-table';
import { Button } from '@/components/animate-ui/components/buttons/button';
import DashboardPageContainer from '@/components/containers/dashboard-page-container';
import StudentInTheClassRoom from '@/components/forms/student-in-the-class-room-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClassRoom, Major, User } from '@/types/model-type';
import { PageProps } from '@/types/page-props';
import { usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';

interface ClassRoomDetailProps extends ClassRoom {
    students: Array<User>;
    major: Major;
}

const ClassRoomDetail = () => {
    const { classroom } = usePage().props as PageProps & { classroom: ClassRoomDetailProps };

    return (
        <DashboardPageContainer>
            <main className="flex flex-col gap-6">
                <section className="flex">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>
                                Nama Kelas: {classroom.grade} {classroom.major.name}
                            </CardTitle>
                            <CardDescription>Jumlah Siswa {classroom.students.length}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2"></CardContent>
                    </Card>
                </section>
                <section className="flex flex-col gap-2">
                    <h1>Siswa Pada Kelas</h1>
                    <StudentInTheClassRoom type="create" classRoomId={classroom.id}>
                        <Button className="w-fit">
                            <Plus />
                            Siswa
                        </Button>
                    </StudentInTheClassRoom>
                    <StudentTable params="classroom" classRoomId={classroom.id} users={classroom.students} />
                </section>
            </main>
        </DashboardPageContainer>
    );
};

export default ClassRoomDetail;
