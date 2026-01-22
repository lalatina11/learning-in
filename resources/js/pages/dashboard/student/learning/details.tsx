import DashboardPageContainer from '@/components/containers/dashboard-page-container';
import QuizTable from '@/components/student-components/quiz-table';
import TaskSubmissionTable from '@/components/student-components/task-submission-table';
import StudyRoomModuleTable from '@/components/teacher-components/study-room-module-table';
import StudyRoomTaskTable from '@/components/teacher-components/study-room-task-table';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    StudyRoomModule,
    StudyRoomTaskWithSubmissionAndStudent,
    StudyRoomWithClassRoomAndTeacherAndMajorAndLearningSubjectAndStudents,
} from '@/types';
import { QuizWithRatingsAndStudent } from '@/types/model-type';
import { PageProps } from '@/types/page-props';
import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export interface StudyRoom extends StudyRoomWithClassRoomAndTeacherAndMajorAndLearningSubjectAndStudents {
    modules: Array<StudyRoomModule>;
    tasks: Array<StudyRoomTaskWithSubmissionAndStudent>;
    quizzes: Array<QuizWithRatingsAndStudent>;
}

interface Props extends PageProps {
    studyRoom: StudyRoom;
}

const Details = () => {
    const { studyRoom, auth } = usePage().props as Props;
    console.log({ quizzes: studyRoom.quizzes, userId: auth?.user?.id });

    return (
        <DashboardPageContainer>
            <div className="flex flex-col gap-6">
                <div>
                    <Button asChild>
                        <Link href={'/dashboard/learning'}>
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
                        </CardDescription>
                    </CardHeader>
                </Card>
                <div id="modules">
                    <div className="mt-3 flex flex-col gap-3">
                        <h1 className="text-lg font-semibold">Materi KBM</h1>
                        <StudyRoomModuleTable />
                    </div>
                </div>
                <div id="tasks">
                    <div className="mt-3 flex flex-col gap-3">
                        <h1 className="text-lg font-semibold">Daftar Tugas</h1>
                        <StudyRoomTaskTable />
                    </div>
                </div>
                <div id="task-submissions">
                    <div className="mt-3 flex flex-col gap-3">
                        <h1 className="text-lg font-semibold">Daftar Pengerjaan Tugas</h1>
                        <TaskSubmissionTable tasks={studyRoom.tasks} />
                    </div>
                </div>
                <div id="task-submissions">
                    <div className="mt-3 flex flex-col gap-3">
                        <h1 className="text-lg font-semibold">Daftar Penilaian Quiz</h1>
                        <QuizTable quizzes={studyRoom.quizzes} />
                    </div>
                </div>
            </div>
        </DashboardPageContainer>
    );
};

export default Details;
