import ClassRoomTable from '@/components/admin-components/class-room-table';
import MajorTable from '@/components/admin-components/major-table';
import StudyRoomTable from '@/components/admin-components/study-room-table';
import DashboardPageContainer from '@/components/containers/dashboard-page-container';
import ClassRoomForm from '@/components/forms/class-room-form';
import MajorForm from '@/components/forms/major-form';
import StudyRoomForm from '@/components/forms/study-room-form';
import { Button } from '@/components/ui/button';
import { ClassRoomWithMajor, Major, StudyRoomWithClassRoomAndTeacher } from '@/types';
import { Plus } from 'lucide-react';

interface Props {
    majors: Array<Major>;
    classRooms: Array<ClassRoomWithMajor>;
    studyRooms: Array<StudyRoomWithClassRoomAndTeacher>;
}

const School = ({ majors, classRooms, studyRooms }: Props) => {
    console.log({ studyRooms });

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
                <StudyRoomForm type="create">
                    <Button className="w-fit">
                        <Plus />
                        <span className="hidden md:inline">Kegiatan Mengajar</span>
                        <span className="inline md:hidden">KBM</span>
                    </Button>
                </StudyRoomForm>
                <StudyRoomTable studyRooms={studyRooms} />
            </div>
        </DashboardPageContainer>
    );
};

export default School;
