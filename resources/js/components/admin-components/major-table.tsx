import { Major } from '@/types';
import { Edit, Trash } from 'lucide-react';
import CreateOrUpdateOrDeleteMajorForm from '../forms/create-or-update-or-delete-major-form';
import { Button } from '../ui/button';
import { CardContent } from '../ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface Props {
    majors: Array<Major>;
}

const MajorTable = ({ majors }: Props) => {
    return (
        <div className="flex flex-col gap-3">
            <div>
                <h1 className="text-lg font-semibold">Daftar Jurusan Yang Tersedia</h1>
            </div>
            <CardContent>
                <Table className="w-full md:w-2/3">
                    <TableCaption>Berhasil Mendapatkan data semua jurusan</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No</TableHead>
                            <TableHead>Jurusan</TableHead>
                            <TableHead className="text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {majors.map((major, index) => (
                            <TableRow key={major.id}>
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell>{major.name}</TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-center gap-2">
                                        <CreateOrUpdateOrDeleteMajorForm type="update" major={major}>
                                            <Button>
                                                <Edit />
                                                <span className="hidden md:inline">Edit</span>
                                            </Button>
                                        </CreateOrUpdateOrDeleteMajorForm>
                                        <CreateOrUpdateOrDeleteMajorForm type="delete" major={major}>
                                            <Button variant={'destructive'}>
                                                <Trash />
                                                <span className="hidden md:inline">Hapus</span>
                                            </Button>
                                        </CreateOrUpdateOrDeleteMajorForm>
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

export default MajorTable;
