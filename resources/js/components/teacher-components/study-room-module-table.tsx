import { Auth, StudyRoomModule, StudyRoomWithClassRoomAndTeacherAndMajorAndLearningSubjectAndStudents } from '@/types';
import { PageProps } from '@/types/page-props';
import { usePage } from '@inertiajs/react';
import { Copy, Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';
import StudyRoomModuleForm from '../forms/study-room-module-form';
import { Button } from '../ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

export interface StudyRoom extends StudyRoomWithClassRoomAndTeacherAndMajorAndLearningSubjectAndStudents {
    modules: Array<StudyRoomModule>;
}

const StudyRoomModuleTable = () => {
    const { studyRoom, auth } = usePage().props as PageProps & { studyRoom: StudyRoom; auth: Auth };

    const { modules } = studyRoom;

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
                {modules.map((module, index) => (
                    <TableRow key={module.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{module.description}</TableCell>
                        <TableCell>
                            <span className="max-w-[300px] truncate">{module.url.slice(37)}</span>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() => {
                                        navigator.clipboard.writeText(module.url);
                                        toast.success('URL Modul Pembelajaran berhasil di copy!');
                                    }}
                                >
                                    <Copy />
                                    <span className="hidden md:inline">Copy Url</span>
                                </Button>
                                <StudyRoomModuleForm type="update" module={module}>
                                    <Button>
                                        <Edit />
                                        <span className="hidden md:inline">Edit</span>
                                    </Button>
                                </StudyRoomModuleForm>
                                <StudyRoomModuleForm type="delete" module={module}>
                                    <Button variant={'destructive'}>
                                        <Trash />
                                        <span className="hidden md:inline">Hapus</span>
                                    </Button>
                                </StudyRoomModuleForm>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default StudyRoomModuleTable;
