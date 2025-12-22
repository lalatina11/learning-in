import DashboardPageContainer from '@/components/containers/dashboard-page-container';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { StudyRoomWithClassRoomAndTeacherAndTeacher } from '@/types';

interface Props {
    studyRoom: StudyRoomWithClassRoomAndTeacherAndTeacher;
}

const StudyRoomDetail = ({ studyRoom }: Props) => {
    console.log({ studyRoom });

    return (
        <DashboardPageContainer>
            <Card>
                <CardHeader>
                    <CardTitle>
                        <div className="flex flex-col gap-1">
                            <span>Tingkatan: {studyRoom.classroom.major.name}</span>
                            {/* <span>Mata Pelajaran: {studyRoom.classroom}</span> */}
                        </div>
                    </CardTitle>
                </CardHeader>
            </Card>
        </DashboardPageContainer>
    );
};

export default StudyRoomDetail;
