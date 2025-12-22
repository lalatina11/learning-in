import { User } from '@/types';
import { router } from '@inertiajs/react';
import { Trash } from 'lucide-react';
import CreateOrUpdateUserForm from '../forms/user-form';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface Props {
    users: Array<User>;
}

const UserTable = ({ users }: Props) => {
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
                                        <CreateOrUpdateUserForm user={user} />
                                        <Button variant={'destructive'} onClick={() => router.delete(`/dashboard/admin/user/${user.id}`)}>
                                            <Trash />
                                            <span className="hidden md:block">Hapus</span>
                                        </Button>
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

export default UserTable;
