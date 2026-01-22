import DashboardPageContainer from '@/components/containers/dashboard-page-container';
import StudyRoomTable from '@/components/teacher-components/study-room-table';
import { StudyRoomWithClassRoomAndTeacherAndMajorAndLearningSubjectAndStudents } from '@/types';
import { PageProps } from '@/types/page-props';
import { usePage } from '@inertiajs/react';

type StudyRoomDetail = StudyRoomWithClassRoomAndTeacherAndMajorAndLearningSubjectAndStudents;

const Learning = () => {
    const { studyRooms } = usePage().props as PageProps & {
        studyRooms: Array<StudyRoomDetail>;
    };

    return (
        <DashboardPageContainer>
            <main className="flex flex-col gap-6">
                <section>Daftar Kelas</section>
                <StudyRoomTable />
            </main>
        </DashboardPageContainer>
    );
};

export default Learning;
