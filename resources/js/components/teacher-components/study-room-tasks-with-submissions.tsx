import { TaskSubmissionsWithStudent, TaskWithSubmission } from '@/pages/dashboard/teacher/learning/details';
import { Copy, Pen } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../animate-ui/components/buttons/button';
import { Accordion, AccordionButton, AccordionItem, AccordionPanel } from '../animate-ui/components/headless/accordion';
import TaskSubmissionForm from '../forms/task-submission-form';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface Props {
    tasks: Array<TaskWithSubmission>;
}

interface AccordionProps {
    task: TaskWithSubmission;
    no: number;
}

interface TableProps {
    submission: Array<TaskSubmissionsWithStudent>;
}

export default function StudyRoomWithTaskSubmissions({ tasks }: Props) {
    return (
        <div className="flex flex-col gap-2">
            {tasks.map((task, index) => (
                <StudyRoomTaskSubmissionAccordion key={task.id} task={task} no={index + 1} />
            ))}
        </div>
    );
}

function StudyRoomTaskSubmissionAccordion({ task, no }: AccordionProps) {
    return (
        <Card>
            <CardContent>
                <Accordion>
                    <AccordionItem>
                        <AccordionButton>Tugas No.{no}</AccordionButton>
                        <AccordionPanel>
                            {task.task_submissions.length < 1 ? (
                                'Belum siswa ada yang mengerjakan tugas'
                            ) : (
                                <TaskSubmissionTable submission={task.task_submissions} />
                            )}
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    );
}

function TaskSubmissionTable({ submission }: TableProps) {
    return (
        <Table>
            <TableCaption>Semua data pekerjaan tugas telah dimuat.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>NIM</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Nilai</TableHead>
                    <TableHead>Status Penilaian</TableHead>
                    <TableHead>Catatan Guru</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {submission.map((submission, idx) => (
                    <TableRow key={submission.id}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{submission.student.master_number}</TableCell>
                        <TableCell>{submission.student.name}</TableCell>
                        <TableCell>{submission.rate}</TableCell>
                        <TableCell>
                            <Badge variant={submission.is_rated ? 'default' : 'secondary'}>
                                {submission.is_rated ? 'Sudah Dinilai' : 'Belum dinilai'}
                            </Badge>
                        </TableCell>
                        <TableCell>{submission.teacher_note}</TableCell>
                        <TableCell>{submission.url.slice(0, 5)}</TableCell>
                        <TableCell>
                            <div className="flex items-center justify-center gap-2">
                                <Button
                                    onClick={() => {
                                        window.navigator.clipboard.writeText(submission.url);
                                        toast.success('Berhasil copy url pengerjaan tugas');
                                    }}
                                >
                                    <Copy />
                                    Copy
                                </Button>
                                <TaskSubmissionForm type="taskRating" taskSubmission={submission}>
                                    <Button>
                                        <Pen />
                                        Beri Nilai
                                    </Button>
                                </TaskSubmissionForm>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
