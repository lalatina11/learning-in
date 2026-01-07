import StudentTable from '@/components/admin-components/student-table';
import { Button } from '@/components/animate-ui/components/buttons/button';
import DashboardPageContainer from '@/components/containers/dashboard-page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClassRoom, LearningSubject, Major, StudyRoom, User } from '@/types/model-type';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface ClassRoomWithMajorAndStudent extends ClassRoom {
    students: Array<User>;
    major: Major;
}

export interface CustomStudyRoom extends StudyRoom {
    classroom: ClassRoomWithMajorAndStudent;
    learning_subject: LearningSubject;
    teacher: User;
}

interface Props {
    studyRoom: CustomStudyRoom;
}

const StudyRoomDetail = ({ studyRoom }: Props) => {
    const [isShowStudentsTable, setIsShowStudentsTable] = useState(false);

    const handleSwitchIsShowStudentTable = () => setIsShowStudentsTable((prev) => !prev);

    return (
        <DashboardPageContainer>
            <div className="flex flex-col gap-6">
                <div>
                    <Button asChild>
                        <Link href={'/dashboard/admin/school'}>
                            <ArrowLeft /> Kembali
                        </Link>
                    </Button>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Detail KBM</CardTitle>
                        <CardDescription className="flex flex-col gap-1">
                            <span className="flex flex-1">
                                <span className="flex-1/3 sm:flex-1/2 md:flex-2/8 lg:flex-1/8">Mapel</span>
                                <span className="flex-2/3 sm:flex-1/2 md:flex-6/8 lg:flex-7/8">: {studyRoom.learning_subject.name}</span>
                            </span>
                            <span className="flex flex-1">
                                <span className="flex-1/3 sm:flex-1/2 md:flex-2/8 lg:flex-1/8">Tingkatan</span>
                                <span className="flex-2/3 sm:flex-1/2 md:flex-6/8 lg:flex-7/8">: {studyRoom.classroom.grade}</span>
                            </span>
                            <span className="flex flex-1">
                                <span className="flex-1/3 sm:flex-1/2 md:flex-2/8 lg:flex-1/8">Jurusan</span>
                                <span className="flex-2/3 sm:flex-1/2 md:flex-6/8 lg:flex-7/8">: {studyRoom.classroom.major.name}</span>
                            </span>
                            <span className="flex flex-1">
                                <span className="flex-1/3 sm:flex-1/2 md:flex-2/8 lg:flex-1/8">NIP Guru</span>
                                <span className="flex-2/3 sm:flex-1/2 md:flex-6/8 lg:flex-7/8">: {studyRoom.teacher.master_number}</span>
                            </span>
                            <span className="flex flex-1">
                                <span className="flex-1/3 sm:flex-1/2 md:flex-2/8 lg:flex-1/8">Nama Guru</span>
                                <span className="flex-2/3 sm:flex-1/2 md:flex-6/8 lg:flex-7/8">: {studyRoom.teacher.name}</span>
                            </span>
                            <span className="flex flex-1">
                                <span className="flex-1/3 sm:flex-1/2 md:flex-2/8 lg:flex-1/8">Jumlah Siswa</span>
                                <span className="flex-2/3 sm:flex-1/2 md:flex-6/8 lg:flex-7/8">: {studyRoom.classroom.students.length}</span>
                            </span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        <Button variant={isShowStudentsTable ? 'destructive' : 'default'} className="w-fit" onClick={handleSwitchIsShowStudentTable}>
                            {isShowStudentsTable ? <EyeOff /> : <Eye />}
                            <div className="flex items-center gap-1">
                                <span className="hidden lg:inline">{isShowStudentsTable ? 'Sembunyikan' : 'Lihat'}</span>
                                <span>Siswa</span>
                            </div>
                        </Button>
                        {isShowStudentsTable && (
                            <div>
                                <StudentTable params="studyroom" users={studyRoom.classroom.students} classRoomId={studyRoom.classroom.id} />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardPageContainer>
    );
};

export default StudyRoomDetail;
