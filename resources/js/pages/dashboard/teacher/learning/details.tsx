import StudentTable from '@/components/admin-components/student-table';
import DashboardPageContainer from '@/components/containers/dashboard-page-container';
import StudyRoomModuleForm from '@/components/forms/study-room-module-form';
import StudyRoomQuizForm from '@/components/forms/study-room-quiz-form';
import StudyRoomTaskForm from '@/components/forms/study-room-task-form';
import StudyRoomModuleTable from '@/components/teacher-components/study-room-module-table';
import StudyRoomQuizTable from '@/components/teacher-components/study-room-quiz-table';
import StudyRoomQuizWithRatings from '@/components/teacher-components/study-room-quiz-with-ratings';
import StudyRoomTaskTable from '@/components/teacher-components/study-room-task-table';
import StudyRoomWithTaskSubmissions from '@/components/teacher-components/study-room-tasks-with-submissions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Major } from '@/types';
import { ClassRoom, LearningSubject, QuizWithRatingsAndStudent, StudyRoom, StudyRoomTask, StudyRoomTaskSubmission, User } from '@/types/model-type';
import { PageProps } from '@/types/page-props';
import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Eye, EyeOff, Plus } from 'lucide-react';
import { useState } from 'react';

interface ClassRoomDetail extends ClassRoom {
    students: Array<User>;
    major: Major;
}

export interface TaskSubmissionsWithStudent extends StudyRoomTaskSubmission {
    student: User;
}

export interface TaskWithSubmission extends StudyRoomTask {
    task_submissions: Array<TaskSubmissionsWithStudent>;
}

interface StudyRoomDetail extends StudyRoom {
    classroom: ClassRoomDetail;
    learning_subject: LearningSubject;
    teacher: User;
    tasks: Array<TaskWithSubmission>;
    quizzes: Array<QuizWithRatingsAndStudent>;
}

interface Props extends PageProps {
    studyRoom: StudyRoomDetail;
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
                                <span className="flex-2/3 sm:flex-1/2 md:flex-6/8 lg:flex-7/8">: {studyRoom.classroom.students.length}</span>
                            </span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        <div>
                            <Button onClick={handleSwitchStudentTableVisibility}>
                                {isShowStudentsTable ? <EyeOff /> : <Eye />}
                                <span>
                                    <span className="hidden sm:inline">{isShowStudentsTable ? 'Sembunyikan' : 'Lihat'}</span> Siswa
                                </span>
                            </Button>
                        </div>
                        {isShowStudentsTable && (
                            <div>
                                <StudentTable users={studyRoom.classroom.students} classRoomId={studyRoom.class_room_id} params="studyroom" />
                            </div>
                        )}
                    </CardContent>
                </Card>
                <div>
                    <div className="mt-3 flex flex-col gap-3">
                        <h1 className="text-lg font-semibold">Materi KBM</h1>
                        <div className="flex items-center gap-2">
                            <StudyRoomModuleForm type="create" studyRoomId={studyRoom.id}>
                                <Button>
                                    <Plus />
                                    <span>
                                        <span className="hidden sm:inline">Tambah</span> Materi
                                    </span>
                                </Button>
                            </StudyRoomModuleForm>
                        </div>
                        <StudyRoomModuleTable />
                    </div>
                </div>
                <div>
                    <div className="mt-3 flex flex-col gap-3">
                        <h1 className="text-lg font-semibold">Daftar Tugas</h1>
                        <div className="flex items-center gap-2">
                            <StudyRoomTaskForm type="create" studyRoomId={studyRoom.id}>
                                <Button>
                                    <Plus />
                                    <span>
                                        <span className="hidden sm:inline">Tambah</span> Tugas
                                    </span>
                                </Button>
                            </StudyRoomTaskForm>
                        </div>
                        <StudyRoomTaskTable />
                    </div>
                    <div className="mt-3 flex flex-col gap-3">
                        <h1 className="text-lg font-semibold">Daftar Pengerjaan Tugas</h1>
                        <div className="flex items-center gap-2"></div>
                        <StudyRoomWithTaskSubmissions tasks={studyRoom.tasks} />
                    </div>
                </div>
                <div>
                    <div className="mt-3 flex flex-col gap-3">
                        <h1 className="text-lg font-semibold">Daftar Quiz</h1>
                        <div className="flex items-center gap-2">
                            <StudyRoomQuizForm type="create" studyRoomId={studyRoom.id}>
                                <Button>
                                    <Plus />
                                    <span>
                                        <span className="hidden sm:inline">Tambah</span> Quiz
                                    </span>
                                </Button>
                            </StudyRoomQuizForm>
                        </div>
                        <StudyRoomQuizTable />
                    </div>
                    <div className="mt-3 flex flex-col gap-3">
                        <h1 className="text-lg font-semibold">Daftar Penilaian Quiz</h1>
                        <div className="flex items-center gap-2"></div>
                        <StudyRoomQuizWithRatings quizzes={studyRoom.quizzes} />
                    </div>
                </div>
            </div>
        </DashboardPageContainer>
    );
};

export default Details;
