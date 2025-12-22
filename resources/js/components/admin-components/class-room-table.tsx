import { ClassRoomWithMajor } from '@/types';
import { Edit, Trash } from 'lucide-react';
import ClassRoomForm from '../forms/class-room-form';
import { Button } from '../ui/button';
import { CardContent } from '../ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface Props {
    classRooms: Array<ClassRoomWithMajor>;
}

const ClassRoomTable = ({ classRooms }: Props) => {
    return (
        <div className="flex flex-col gap-3">
            <div>
                <h1 className="text-lg font-semibold">Daftar Kelas Yang Tersedia</h1>
            </div>
            <CardContent>
                <Table className="w-full md:w-2/3">
                    <TableCaption>Berhasil Mendapatkan data semua Kelas</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No</TableHead>
                            <TableHead>Tingkatan</TableHead>
                            <TableHead>Jurusan</TableHead>
                            <TableHead className="text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {classRooms.map((classRoom, index) => (
                            <TableRow key={classRoom.id}>
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell>{classRoom.grade}</TableCell>
                                <TableCell>{classRoom.major.name}</TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-center gap-2">
                                        <ClassRoomForm type="update" classRoom={classRoom}>
                                            <Button>
                                                <Edit />
                                                <span className="hidden md:inline">Edit</span>
                                            </Button>
                                        </ClassRoomForm>
                                        <ClassRoomForm type="delete" classRoom={classRoom}>
                                            <Button variant={'destructive'}>
                                                <Trash />
                                                <span className="hidden md:inline">Hapus</span>
                                            </Button>
                                        </ClassRoomForm>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </div>
    );
};

export default ClassRoomTable;
