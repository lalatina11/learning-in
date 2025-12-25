import StudentTable from '@/components/admin-components/student-table';
import DashboardPageContainer from '@/components/containers/dashboard-page-container';
import StudentInTheStudyRoomForm from '@/components/forms/student-in-the-study-room-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StudyRoomWithClassRoomAndTeacherAndMajorAndLearningSubjectAndStudents } from '@/types';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Plus } from 'lucide-react';

interface Props {
    studyRoom: StudyRoomWithClassRoomAndTeacherAndMajorAndLearningSubjectAndStudents;
}

const StudyRoomDetail = ({ studyRoom }: Props) => {
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
                                <span className="flex-1/3 sm:flex-1/2 md:flex-2/8 lg:flex-1/8">Mapel:</span>
                                <span className="flex-2/3 sm:flex-1/2 md:flex-6/8 lg:flex-7/8">{studyRoom.learning_subject.name}</span>
                            </span>
                            <span className="flex flex-1">
                                <span className="flex-1/3 sm:flex-1/2 md:flex-2/8 lg:flex-1/8">Tingkatan:</span>
                                <span className="flex-2/3 sm:flex-1/2 md:flex-6/8 lg:flex-7/8">{studyRoom.classroom.grade}</span>
                            </span>
                            <span className="flex flex-1">
                                <span className="flex-1/3 sm:flex-1/2 md:flex-2/8 lg:flex-1/8">Jurusan:</span>
                                <span className="flex-2/3 sm:flex-1/2 md:flex-6/8 lg:flex-7/8">{studyRoom.classroom.major.name}</span>
                            </span>
                            <span className="flex flex-1">
                                <span className="flex-1/3 sm:flex-1/2 md:flex-2/8 lg:flex-1/8">NIP Guru:</span>
                                <span className="flex-2/3 sm:flex-1/2 md:flex-6/8 lg:flex-7/8">{studyRoom.teacher.master_number}</span>
                            </span>
                            <span className="flex flex-1">
                                <span className="flex-1/3 sm:flex-1/2 md:flex-2/8 lg:flex-1/8">Nama Guru:</span>
                                <span className="flex-2/3 sm:flex-1/2 md:flex-6/8 lg:flex-7/8">{studyRoom.teacher.name}</span>
                            </span>
                            <span className="flex flex-1">
                                <span className="flex-1/3 sm:flex-1/2 md:flex-2/8 lg:flex-1/8">Jumlah Siswa:</span>
                                <span className="flex-2/3 sm:flex-1/2 md:flex-6/8 lg:flex-7/8">{studyRoom.students.length}</span>
                            </span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        <div>
                            <StudentInTheStudyRoomForm type="create" studyRoomId={studyRoom.id}>
                                <Button>
                                    <Plus />
                                    <div className="flex items-center gap-1">
                                        <span className="hidden md:inline">Tambahkan</span>
                                        <span>Murid</span>
                                    </div>
                                </Button>
                            </StudentInTheStudyRoomForm>
                        </div>
                        <div>
                            <StudentTable users={studyRoom.students} studyRoomId={studyRoom.id} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardPageContainer>
    );
};

export default StudyRoomDetail;
