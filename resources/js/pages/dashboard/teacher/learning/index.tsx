import DashboardPageContainer from '@/components/containers/dashboard-page-container';
import StudyRoomTable from '@/components/teacher-components/study-room-table';
import { StudyRoomWithClassRoomAndTeacherAndMajorAndLearningSubjectAndStudents } from '@/types';
import { PageProps } from '@/types/page-props';
import { usePage } from '@inertiajs/react';

export type StudyRoom = StudyRoomWithClassRoomAndTeacherAndMajorAndLearningSubjectAndStudents;

const Learning = () => {
    const props = usePage().props as PageProps & { studyRooms: Array<StudyRoom> };

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
