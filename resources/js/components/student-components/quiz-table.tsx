import { QuizWithRatingsAndStudent } from '@/types/model-type';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../animate-ui/components/buttons/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface Props {
    quizzes: Array<QuizWithRatingsAndStudent>;
}

const QuizTable = ({ quizzes }: Props) => {
    const quizData = quizzes.map((quizzes) => ({
        ...quizzes,
        rating: quizzes.ratings[0] || null,
    }));

    return (
        <Table>
            <TableCaption>Semua data pekerjaan tugas telah dimuat.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Join</TableHead>
                    <TableHead>Nilai</TableHead>
                    <TableHead>Status Penilaian</TableHead>
                    <TableHead>Catatan Guru</TableHead>
                    <TableHead>Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {quizData.map(
                    (quiz, idx) =>
                        quiz.rating && (
                            <TableRow key={quiz.id}>
                                <TableCell>{idx + 1}</TableCell>
                                <TableCell>{quiz.platform}</TableCell>
                                <TableCell>{quiz.join_code}</TableCell>
                                <TableCell>{quiz.rating.rate}</TableCell>
                                <TableCell>
                                    <Badge>{quiz.rating.is_rated ? 'Sudah Dinilai' : 'Belum dinilai'}</Badge>
                                </TableCell>
                                <TableCell>{quiz.rating.teacher_note}</TableCell>
                                <TableCell>
                                    <Button
                                        onClick={() => {
                                            navigator.clipboard.writeText(quiz.join_code);
                                            toast.success('Berhasil Copy URL');
                                        }}
                                    >
                                        <Copy />
                                        <span className="hidden md:inline">Copy Join Code</span>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ),
                )}
            </TableBody>
        </Table>
    );
};

export default QuizTable;
