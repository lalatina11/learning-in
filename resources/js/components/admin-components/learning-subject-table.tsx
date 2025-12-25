import { switchCaseLearningTypeForIndonesianLang } from '@/lib/switch-cases';
import { LearningSubject } from '@/types';
import { Edit, Trash } from 'lucide-react';
import LearningSubjectForm from '../forms/learning-subject-form';
import { Button } from '../ui/button';
import { CardContent } from '../ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface Props {
    learningSubjects: Array<LearningSubject>;
}

const LearningSubjectTable = ({ learningSubjects }: Props) => {
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
                            <TableHead>Nama</TableHead>
                            <TableHead>Tipe</TableHead>
                            <TableHead className="text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {learningSubjects.map((learningSubject, index) => (
                            <TableRow key={learningSubject.id}>
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell>{learningSubject.name}</TableCell>
                                <TableCell>{switchCaseLearningTypeForIndonesianLang(learningSubject.type)}</TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-center gap-2">
                                        <LearningSubjectForm type="update" learningSubject={learningSubject}>
                                            <Button>
                                                <Edit />
                                                <span className="hidden md:inline">Edit</span>
                                            </Button>
                                        </LearningSubjectForm>
                                        <LearningSubjectForm type="delete" learningSubject={learningSubject}>
                                            <Button variant={'destructive'}>
                                                <Trash />
                                                <span className="hidden md:inline">Hapus</span>
                                            </Button>
                                        </LearningSubjectForm>
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

export default LearningSubjectTable;
