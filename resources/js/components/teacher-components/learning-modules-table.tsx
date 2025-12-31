import { Auth, StudyRoomModule, StudyRoomWithClassRoomAndTeacherAndMajorAndLearningSubjectAndStudents } from '@/types';
import { PageProps } from '@/types/page-props';
import { usePage } from '@inertiajs/react';
import { Copy, Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';
import LearningModuleForm from '../forms/learning-module-form';
import { Button } from '../ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

export interface StudyRoom extends StudyRoomWithClassRoomAndTeacherAndMajorAndLearningSubjectAndStudents {
    learning_modules: Array<StudyRoomModule>;
}

const LearningModulTable = () => {
    const { studyRoom, auth } = usePage().props as PageProps & { studyRoom: StudyRoom; auth: Auth };

    const { learning_modules } = studyRoom;

    return (
        <Table className="w-full">
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">#</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Url</TableHead>
                    <TableHead>Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {learning_modules.map((learningModule, index) => (
                    <TableRow key={learningModule.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{learningModule.description}</TableCell>
                        <TableCell>
                            <span className="max-w-[300px] truncate">{learningModule.url.slice(37)}</span>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() => {
                                        navigator.clipboard.writeText(learningModule.url);
                                        toast.success('URL Modul Pembelajaran berhasil di copy!');
                                    }}
                                >
                                    <Copy />
                                    <span className="hidden md:inline">Copy Url</span>
                                </Button>
                                <LearningModuleForm type="update" learningModule={learningModule}>
                                    <Button>
                                        <Edit />
                                        <span className="hidden md:inline">Edit</span>
                                    </Button>
                                </LearningModuleForm>
                                <LearningModuleForm type="delete" learningModule={learningModule}>
                                    <Button variant={'destructive'}>
                                        <Trash />
                                        <span className="hidden md:inline">Hapus</span>
                                    </Button>
                                </LearningModuleForm>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default LearningModulTable;
