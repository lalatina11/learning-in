import { Auth, StudyRoomModule, StudyRoomWithClassRoomAndTeacherAndMajorAndLearningSubjectAndStudents } from '@/types';
import { PageProps } from '@/types/page-props';
import { usePage } from '@inertiajs/react';
import { Copy, Download, Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';
import StudyRoomModuleForm from '../forms/study-room-module-form';
import { Button } from '../ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

export interface StudyRoom extends StudyRoomWithClassRoomAndTeacherAndMajorAndLearningSubjectAndStudents {
    modules: Array<StudyRoomModule>;
}

interface DownloadButtonProps {
    url: string;
    index: number;
}

const StudyRoomModuleTable = () => {
    const { studyRoom, auth } = usePage().props as PageProps & { studyRoom: StudyRoom; auth: Auth };

    const { modules } = studyRoom;

    const isTeacher = auth.user.role === 'TEACHER';

    function handleModuleDownload(props: DownloadButtonProps) {
        const link = document.createElement('a');
        link.href = props.url;
        link.download = `Module-${studyRoom.classroom.grade}-${studyRoom.classroom.major.name}-${studyRoom.learning_subject.name}-${props.index}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <Table className="w-full">
            <TableCaption>{modules.length > 0 ? 'Semua data Module KBM sudah dimuat.' : 'Belum ada module KBM yang dibuat.'}</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">#</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {modules.map((module, index) => (
                    <TableRow key={module.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{module.description}</TableCell>
                        <TableCell>
                            <div className="flex items-center justify-center gap-2">
                                <Button
                                    onClick={() => {
                                        navigator.clipboard.writeText(module.url);
                                        toast.success('URL Modul Pembelajaran berhasil di copy!');
                                    }}
                                >
                                    <Copy />
                                    <span className="hidden md:inline">Copy Url</span>
                                </Button>
                                {isTeacher && (
                                    <>
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
                                    </>
                                )}
                                {!isTeacher && (
                                    <>
                                        <Button
                                            onClick={() =>
                                                handleModuleDownload({
                                                    url: module.url,
                                                    index: index + 1,
                                                })
                                            }
                                        >
                                            <Download />
                                            <span className="hidden md:inline">Download</span>
                                        </Button>
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

export default StudyRoomModuleTable;
