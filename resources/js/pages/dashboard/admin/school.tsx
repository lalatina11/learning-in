import ClassRoomTable from '@/components/admin-components/class-room-table';
import LearningSubjectTable from '@/components/admin-components/learning-subject-table';
import MajorTable from '@/components/admin-components/major-table';
import StudyRoomTable from '@/components/admin-components/study-room-table';
import DashboardPageContainer from '@/components/containers/dashboard-page-container';
import ClassRoomForm from '@/components/forms/class-room-form';
import LearningSubjectForm from '@/components/forms/learning-subject-form';
import MajorForm from '@/components/forms/major-form';
import StudyRoomForm from '@/components/forms/study-room-form';
import { Button } from '@/components/ui/button';
import { ClassRoomWithMajor, LearningSubject, Major, StudyRoomWithClassRoomAndTeacherAndLearningSubject } from '@/types';
import { Plus } from 'lucide-react';

interface Props {
    majors: Array<Major>;
    classRooms: Array<ClassRoomWithMajor>;
    studyRooms: Array<StudyRoomWithClassRoomAndTeacherAndLearningSubject>;
    learningSubjects: Array<LearningSubject>;
}

const School = ({ majors, classRooms, studyRooms, learningSubjects }: Props) => {
    return (
        <DashboardPageContainer>
            <div className="flex flex-col gap-2">
                <MajorForm type="create">
                    <Button className="w-fit">
                        <Plus /> Tambah Jurusan
                    </Button>
                </MajorForm>
                <MajorTable majors={majors} />
            </div>
            <div className="flex flex-col gap-2">
                <ClassRoomForm type="create">
                    <Button className="w-fit">
                        <Plus /> Tambah Kelas
                    </Button>
                </ClassRoomForm>
                <ClassRoomTable classRooms={classRooms} />
            </div>
            <div className="flex flex-col gap-2">
                <LearningSubjectForm type="create">
                    <Button className="w-fit">
                        <Plus />
                        <span className="hidden md:inline">Tambah Mata Pelajaran</span>
                        <span className="inline md:hidden">Mapel</span>
                    </Button>
                </LearningSubjectForm>
                <LearningSubjectTable learningSubjects={learningSubjects} />
            </div>
            <div className="flex flex-col gap-2">
                <StudyRoomForm type="create">
                    <Button className="w-fit">
                        <Plus />
                        <span className="hidden md:inline">Tambah Kegiatan Mengajar</span>
                        <span className="inline md:hidden">KBM</span>
                    </Button>
                </StudyRoomForm>
                <StudyRoomTable studyRooms={studyRooms} />
            </div>
        </DashboardPageContainer>
    );
};

export default School;
