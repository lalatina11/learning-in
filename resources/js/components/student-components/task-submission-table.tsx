import { StudyRoomTaskWithSubmissionAndStudent } from '@/types';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../animate-ui/components/buttons/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface Props {
    tasks: Array<StudyRoomTaskWithSubmissionAndStudent>;
}

const TaskSubmissionTable = ({ tasks }: Props) => {
    const taskData = tasks.map((task) => ({
        ...task,
        task_submission: task.task_submissions[0] || null,
    }));

    const taskLength = tasks.flatMap((task) => task.task_submissions).length;

    return (
        <Table>
            <TableCaption>{taskLength > 0 ? 'Berhasil memuat semua tugas yang sudah dikerjakan.' : 'Belum ada tugas yang dikerjakan'}</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Nilai</TableHead>
                    <TableHead>Status Penilaian</TableHead>
                    <TableHead>Catatan Guru</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {taskData.map(
                    (task, idx) =>
                        task.task_submission && (
                            <TableRow key={task.id}>
                                <TableCell>{idx + 1}</TableCell>
                                <TableCell>{task.task_submission.rate}</TableCell>
                                <TableCell>
                                    <Badge>{task.task_submission.is_rated ? 'Sudah Dinilai' : 'Belum dinilai'}</Badge>
                                </TableCell>
                                <TableCell>{task.task_submission.teacher_note}</TableCell>
                                <TableCell>{task.task_submission.url.slice(0, 5)}</TableCell>
                                <TableCell>
                                    <Button
                                        onClick={() => {
                                            navigator.clipboard.writeText(task.task_submission.url);
                                            toast.success('Berhasil Copy URL');
                                        }}
                                    >
                                        <Copy />
                                        <span className="hidden md:inline">Copy URL</span>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ),
                )}
            </TableBody>
        </Table>
    );
};

export default TaskSubmissionTable;
