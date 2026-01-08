import { Auth, StudyRoomModule, StudyRoomTask, StudyRoomWithClassRoomAndTeacherAndMajorAndLearningSubjectAndStudents } from '@/types';
import { PageProps } from '@/types/page-props';
import { usePage } from '@inertiajs/react';
import { Copy, Download, Edit, Lock, LockOpen, Trash, UploadIcon } from 'lucide-react';
import { toast } from 'sonner';
import {} from '../animate-ui/components/radix/dropdown-menu';
import StudyRoomTaskForm from '../forms/study-room-task-form';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

export interface StudyRoom extends StudyRoomWithClassRoomAndTeacherAndMajorAndLearningSubjectAndStudents {
    modules: Array<StudyRoomModule>;
    tasks: Array<StudyRoomTask>;
}

interface DownloadButtonProps {
    url: string;
    index: number;
}

const StudyRoomTaskTable = () => {
    const { studyRoom, auth } = usePage().props as PageProps & { studyRoom: StudyRoom; auth: Auth };

    const { tasks } = studyRoom;

    const isTeacher = auth.user.role === 'TEACHER';

    function handleTaskDownload(props: DownloadButtonProps) {
        const link = document.createElement('a');
        link.href = props.url;
        link.download = `Tugas-${studyRoom.classroom.grade}-${studyRoom.classroom.major.name}-${studyRoom.learning_subject.name}-${props.index}`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <Table className="w-full">
            <TableCaption>{tasks.length > 0 ? 'Semua data Tugas KBM sudah dimuat.' : 'Belum ada tugas'}</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">#</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {tasks.map((task, index) => (
                    <TableRow key={task.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{task.description}</TableCell>
                        <TableCell>
                            <Badge variant={task.is_closed ? 'destructive' : 'default'}>{task.is_closed ? 'Ditutup' : 'Dibuka'}</Badge>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center justify-center gap-1">
                                {isTeacher && (
                                    <>
                                        <StudyRoomTaskForm type="update" task={task}>
                                            <Button>
                                                <Edit />
                                                <span className="hidden md:inline">Update</span>
                                            </Button>
                                        </StudyRoomTaskForm>

                                        <StudyRoomTaskForm type="delete" task={task}>
                                            <Button variant={'destructive'}>
                                                <Trash />
                                                <span className="hidden md:inline">Delete</span>
                                            </Button>
                                        </StudyRoomTaskForm>
                                        <StudyRoomTaskForm type="switchClosed" task={task}>
                                            <Button variant={task.is_closed ? 'default' : 'destructive'}>
                                                {task.is_closed ? <LockOpen /> : <Lock />}
                                                <span className="hidden md:inline">{task.is_closed ? 'Buka' : 'Tutup'}</span>
                                            </Button>
                                        </StudyRoomTaskForm>
                                    </>
                                )}
                                <Button
                                    onClick={() => {
                                        navigator.clipboard.writeText(task.url);
                                        toast.success('URL Modul Pembelajaran berhasil di copy!');
                                    }}
                                >
                                    <Copy />
                                    <span className="hidden md:inline">Copy Url</span>
                                </Button>
                                {!isTeacher && (
                                    <>
                                        <Button
                                            onClick={() =>
                                                handleTaskDownload({
                                                    url: task.url,
                                                    index: index + 1,
                                                })
                                            }
                                        >
                                            <Download />
                                            <span className="hidden md:inline">Download</span>
                                        </Button>
                                        {!task.is_closed && (
                                            <StudyRoomTaskForm type="submission" task={task}>
                                                <Button>
                                                    <UploadIcon />
                                                    <span className="hidden md:inline">Kerjakan</span>
                                                </Button>
                                            </StudyRoomTaskForm>
                                        )}
                                    </>
                                )}
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default StudyRoomTaskTable;
