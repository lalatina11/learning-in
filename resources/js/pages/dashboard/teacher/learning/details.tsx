import StudentTable from '@/components/admin-components/student-table';
import DashboardPageContainer from '@/components/containers/dashboard-page-container';
import LearningModuleForm from '@/components/forms/learning-module-form';
import LearningModulTable from '@/components/teacher-components/learning-modules-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LearningModule, StudyRoomWithClassRoomAndTeacherAndMajorAndLearningSubjectAndStudents } from '@/types';
import { PageProps } from '@/types/page-props';
import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Eye, EyeOff, Plus } from 'lucide-react';
import { useState } from 'react';

export interface StudyRoom extends StudyRoomWithClassRoomAndTeacherAndMajorAndLearningSubjectAndStudents {
    learning_modules: Array<LearningModule>;
}

interface Props extends PageProps {
    studyRoom: StudyRoom;
}

const Details = () => {
    const { studyRoom } = usePage().props as Props;
    console.log(studyRoom);

    const [isShowStudentsTable, setIsShowStudentsTable] = useState(false);

    const handleSwitchStudentTableVisibility = () => {
        setIsShowStudentsTable((prev) => !prev);
    };

    return (
        <DashboardPageContainer>
            <div className="flex flex-col gap-6">
                <div>
                    <Button asChild>
                        <Link href={'/dashboard/teacher/learning'}>
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
                                <span className="flex-2/3 sm:flex-1/2 md:flex-6/8 lg:flex-7/8">: {studyRoom.students.length}</span>
                            </span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        <div>
                            <Button onClick={handleSwitchStudentTableVisibility}>
                                {isShowStudentsTable ? <EyeOff /> : <Eye />}
                                <span>
                                    <span className="hidden sm:inline">{isShowStudentsTable ? 'Sembunyikan' : 'Lihat'}</span> Murid
                                </span>
                            </Button>
                        </div>
                        {isShowStudentsTable && (
                            <div>
                                <StudentTable users={studyRoom.students} studyRoomId={studyRoom.id} />
                            </div>
                        )}
                    </CardContent>
                </Card>
                <div>
                    <div className="mt-3 flex flex-col gap-3">
                        <h1 className="text-lg font-semibold">Materi KBM</h1>
                        <div className="flex items-center gap-2">
                            <LearningModuleForm type="create" studyRoomId={studyRoom.id}>
                                <Button>
                                    <Plus />
                                    <span>
                                        <span className="hidden sm:inline">Tambah</span> Materi
                                    </span>
                                </Button>
                            </LearningModuleForm>
                        </div>
                        <LearningModulTable />
                    </div>
                </div>
            </div>
        </DashboardPageContainer>
    );
};

export default Details;
