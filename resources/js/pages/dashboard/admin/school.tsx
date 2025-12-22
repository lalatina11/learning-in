import ClassRoomTable from '@/components/admin-components/class-room-table';
import MajorTable from '@/components/admin-components/major-table';
import DashboardPageContainer from '@/components/containers/dashboard-page-container';
import ClassRoomForm from '@/components/forms/class-room-form';
import CreateOrUpdateMajorForm from '@/components/forms/major-form';
import { Button } from '@/components/ui/button';
import { ClassRoomWithMajor, Major } from '@/types';
import { Plus } from 'lucide-react';

interface Props {
    majors: Array<Major>;
    classRooms: Array<ClassRoomWithMajor>;
}

const School = ({ majors, classRooms }: Props) => {
    console.log({ classRooms, majors });

    return (
        <DashboardPageContainer>
            <div className="flex flex-col gap-2">
                <CreateOrUpdateMajorForm type="create">
                    <Button className="w-fit">
                        <Plus /> Tambah Jurusan
                    </Button>
                </CreateOrUpdateMajorForm>
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
        </DashboardPageContainer>
    );
};

export default School;
