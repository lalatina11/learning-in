import { Auth, StudyRoomModule, StudyRoomTask, StudyRoomWithClassRoomAndTeacherAndMajorAndLearningSubjectAndStudents } from '@/types';
import { QuizWithRatingsAndStudent } from '@/types/model-type';
import { PageProps } from '@/types/page-props';
import { usePage } from '@inertiajs/react';
import { Copy, Edit, Lock, LockOpen, Trash } from 'lucide-react';
import { toast } from 'sonner';
import {} from '../animate-ui/components/radix/dropdown-menu';
import StudyRoomQuizForm from '../forms/study-room-quiz-form';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

export interface StudyRoom extends StudyRoomWithClassRoomAndTeacherAndMajorAndLearningSubjectAndStudents {
    modules: Array<StudyRoomModule>;
    tasks: Array<StudyRoomTask>;
    quizzes: Array<QuizWithRatingsAndStudent>;
}

interface DownloadButtonProps {
    url: string;
    index: number;
}

const StudyRoomQuizTable = () => {
    const { studyRoom, auth } = usePage().props as PageProps & { studyRoom: StudyRoom; auth: Auth };

    const { quizzes } = studyRoom;

    const isTeacher = auth.user.role === 'TEACHER';

    return (
        <Table className="w-full">
            <TableCaption>{quizzes.length > 0 ? 'Semua data Quiz sudah dimuat.' : 'Belum ada Quiz.'}</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">#</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Kode Gabung</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {quizzes.map((quiz, index) => (
                    <TableRow key={quiz.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{quiz.platform}</TableCell>
                        <TableCell>{quiz.join_code}</TableCell>
                        <TableCell>
                            <Badge variant={!quiz.is_open ? 'destructive' : 'default'}>{!quiz.is_open ? 'Ditutup' : 'Dibuka'}</Badge>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center justify-center gap-1">
                                {isTeacher && (
                                    <>
                                        <StudyRoomQuizForm type="update" quiz={quiz}>
                                            <Button>
                                                <Edit />
                                                <span className="hidden md:inline">Update</span>
                                            </Button>
                                        </StudyRoomQuizForm>

                                        <StudyRoomQuizForm type="delete" quiz={quiz}>
                                            <Button variant={'destructive'}>
                                                <Trash />
                                                <span className="hidden md:inline">Delete</span>
                                            </Button>
                                        </StudyRoomQuizForm>
                                        <StudyRoomQuizForm type="switchClosed" quiz={quiz}>
                                            <Button variant={!quiz.is_open ? 'default' : 'destructive'}>
                                                {!quiz.is_open ? <LockOpen /> : <Lock />}
                                                <span className="hidden md:inline">{!quiz.is_open ? 'Buka' : 'Tutup'}</span>
                                            </Button>
                                        </StudyRoomQuizForm>
                                    </>
                                )}
                                <Button
                                    onClick={() => {
                                        navigator.clipboard.writeText(quiz.join_code);
                                        toast.success('URL Modul Pembelajaran berhasil di copy!');
                                    }}
                                >
                                    <Copy />
                                    <span className="hidden md:inline">Copy Join Code</span>
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default StudyRoomQuizTable;
