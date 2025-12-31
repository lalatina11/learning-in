import { Auth, StudyRoomModule, StudyRoomTask, StudyRoomWithClassRoomAndTeacherAndMajorAndLearningSubjectAndStudents } from '@/types';
import { PageProps } from '@/types/page-props';
import { usePage } from '@inertiajs/react';
import { Copy, Edit, Lock, LockOpen, Trash } from 'lucide-react';
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

const StudyRoomTaskTable = () => {
    const { studyRoom, auth } = usePage().props as PageProps & { studyRoom: StudyRoom; auth: Auth };

    const { tasks } = studyRoom;

    return (
        <Table className="w-full">
            <TableCaption>Berhasil mendapatkan semua data Penugasan</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">#</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Url</TableHead>
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
                            <span className="max-w-[300px] truncate">{task.url.slice(37)}</span>
                        </TableCell>
                        <TableCell>
                            <Badge variant={task.is_closed ? 'destructive' : 'default'}>{task.is_closed ? 'Ditutup' : 'Dibuka'}</Badge>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-1">
                                <StudyRoomTaskForm type="update" task={task}>
                                    <Button className="flex-1">
                                        <Edit />
                                        <span className="hidden md:inline">Update</span>
                                    </Button>
                                </StudyRoomTaskForm>
                                <StudyRoomTaskForm type="delete" task={task}>
                                    <Button className="flex-1" variant={'destructive'}>
                                        <Trash />
                                        <span className="hidden md:inline">Delete</span>
                                    </Button>
                                </StudyRoomTaskForm>
                                <StudyRoomTaskForm type="switchClosed" task={task}>
                                    <Button className="flex-1" variant={task.is_closed ? 'default' : 'destructive'}>
                                        {task.is_closed ? <LockOpen /> : <Lock />}
                                        <span className="hidden md:inline">{task.is_closed ? 'Buka' : 'Tutup'}</span>
                                    </Button>
                                </StudyRoomTaskForm>
                                <Button
                                    onClick={() => {
                                        navigator.clipboard.writeText(task.url);
                                        toast.success('URL Modul Pembelajaran berhasil di copy!');
                                    }}
                                >
                                    <Copy />
                                    <span className="hidden md:inline">Copy Url</span>
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default StudyRoomTaskTable;
