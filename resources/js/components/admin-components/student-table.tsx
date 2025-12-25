import { User } from '@/types';
import { SwitchCamera, Trash } from 'lucide-react';
import StudentInTheStudyRoomForm from '../forms/student-in-the-study-room-form';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface Props {
    users: Array<User>;
    studyRoomId: number;
}

const StudentTable = ({ users, studyRoomId }: Props) => {
    return (
        <Card>
            <CardContent>
                <Table>
                    <TableCaption>Semua data pengguna telah didapatkan</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead>NIK/NIM</TableHead>
                            <TableHead>Nama</TableHead>
                            <TableHead>E-Mail</TableHead>
                            <TableHead>Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user, idx) => (
                            <TableRow key={user.id}>
                                <TableCell>{idx + 1}</TableCell>
                                <TableCell>{user.master_number}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <StudentInTheStudyRoomForm type="update" studyRoomId={studyRoomId} user={user}>
                                            <Button>
                                                <SwitchCamera />
                                                <span className="hidden md:inline">Ganti</span>
                                            </Button>
                                        </StudentInTheStudyRoomForm>
                                        <StudentInTheStudyRoomForm type="delete" studyRoomId={studyRoomId} user={user}>
                                            <Button variant={'destructive'}>
                                                <Trash />
                                                <span className="hidden md:block">Hapus</span>
                                            </Button>
                                        </StudentInTheStudyRoomForm>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default StudentTable;
