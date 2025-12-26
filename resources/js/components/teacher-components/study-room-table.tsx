import { Auth, StudyRoomWithClassRoomAndTeacherAndMajorAndLearningSubjectAndStudents } from '@/types';
import { PageProps } from '@/types/page-props';
import { Link, usePage } from '@inertiajs/react';
import { ScanEyeIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

export type StudyRoom = StudyRoomWithClassRoomAndTeacherAndMajorAndLearningSubjectAndStudents;

const StudyRoomTable = () => {
    const { studyRooms, auth } = usePage().props as PageProps & { studyRooms: Array<StudyRoom>; auth: Auth };
    console.log(studyRooms);

    return (
        <Table className="w-1 sm:w-2/3">
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">#</TableHead>
                    <TableHead>Kelas</TableHead>
                    <TableHead>Mapel</TableHead>
                    <TableHead>Guru</TableHead>
                    <TableHead>Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {studyRooms.map((studyRoom, index) => (
                    <TableRow key={studyRoom.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>
                            {studyRoom.classroom.grade} {studyRoom.classroom.major.name}
                        </TableCell>
                        <TableCell>{studyRoom.learning_subject.name}</TableCell>
                        <TableCell>{auth.user.name}</TableCell>
                        <TableCell>
                            <Button asChild>
                                <Link href={`/dashboard/teacher/learning/${studyRoom.id}`}>
                                    <ScanEyeIcon />
                                    Details
                                </Link>
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default StudyRoomTable;
