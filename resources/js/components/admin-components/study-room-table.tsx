import { ClassRoomWithMajor, StudyRoomWithClassRoomAndTeacher } from '@/types';
import { PageProps } from '@/types/page-props';
import { usePage } from '@inertiajs/react';
import { Edit, Trash } from 'lucide-react';
import StudyRoomForm from '../forms/study-room-form';
import { Button } from '../ui/button';
import { CardContent } from '../ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface Props {
    studyRooms: Array<StudyRoomWithClassRoomAndTeacher>;
}

const StudyRoomTable = ({ studyRooms }: Props) => {
    const { classRooms } = usePage().props as PageProps & { classRooms: Array<ClassRoomWithMajor> };
    return (
        <div className="flex flex-col gap-3">
            <div>
                <h1 className="text-lg font-semibold">Daftar KBM Yang Tersedia</h1>
            </div>
            <CardContent>
                <Table className="w-full md:w-2/3">
                    <TableCaption>Berhasil Mendapatkan data semua KBM</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No</TableHead>
                            <TableHead>Kelas</TableHead>
                            <TableHead>Guru</TableHead>
                            <TableHead className="text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {studyRooms.map((studyRoom, index) => {
                            const classRoom = classRooms.find((classRoom) => classRoom.id === studyRoom.classroom.id);
                            return (
                                <TableRow key={studyRoom.id}>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell>{`${classRoom?.grade} ${classRoom?.major.name}`}</TableCell>
                                    <TableCell>{studyRoom.teacher.name}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-center gap-2">
                                            <StudyRoomForm studyRoom={studyRoom} type="update">
                                                <Button>
                                                    <Edit />
                                                    <span className="hidden md:inline">Edit</span>
                                                </Button>
                                            </StudyRoomForm>
                                            <StudyRoomForm studyRoom={studyRoom} type="delete">
                                                <Button variant={'destructive'}>
                                                    <Trash />
                                                    <span className="hidden md:inline">Hapus</span>
                                                </Button>
                                            </StudyRoomForm>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </div>
    );
};

export default StudyRoomTable;
