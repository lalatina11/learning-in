import { QuizRating, QuizWithRatingsAndStudent } from '@/types/model-type';
import { Pen } from 'lucide-react';
import { Button } from '../animate-ui/components/buttons/button';
import { Accordion, AccordionButton, AccordionItem, AccordionPanel } from '../animate-ui/components/headless/accordion';
import QuizSubmissionForm from '../forms/quiz-submission-form';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface Props {
    quizzes: Array<QuizWithRatingsAndStudent>;
}

interface AccordionProps {
    quiz: QuizWithRatingsAndStudent;
    no: number;
}

interface TableProps {
    ratings: Array<QuizRating>;
}

export default function StudyRoomQuizWithRatings({ quizzes }: Props) {
    return (
        <div className="flex flex-col gap-2">
            {quizzes.map((quiz, index) => (
                <StudyRoomTaskSubmissionAccordion key={quiz.id} quiz={quiz} no={index + 1} />
            ))}
        </div>
    );
}

function StudyRoomTaskSubmissionAccordion({ quiz, no }: AccordionProps) {
    return (
        <Card>
            <CardContent>
                <Accordion>
                    <AccordionItem>
                        <AccordionButton>Quiz No.{no}</AccordionButton>
                        <AccordionPanel>
                            <TaskSubmissionTable ratings={quiz.ratings} />
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    );
}

function TaskSubmissionTable({ ratings }: TableProps) {
    return (
        <Table>
            <TableCaption>Semua data pekerjaan tugas telah dimuat.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>NIM</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Nilai</TableHead>
                    <TableHead>Status Penilaian</TableHead>
                    <TableHead>Catatan Guru</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {ratings.map((rating, idx) => (
                    <TableRow key={rating.id}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{rating.student.master_number}</TableCell>
                        <TableCell>{rating.student.name}</TableCell>
                        <TableCell>{rating.rate}</TableCell>
                        <TableCell>
                            <Badge variant={rating.is_rated ? 'default' : 'secondary'}>{rating.is_rated ? 'Sudah Dinilai' : 'Belum dinilai'}</Badge>
                        </TableCell>
                        <TableCell>{rating.teacher_note}</TableCell>
                        <TableCell>
                            <div className="flex items-center justify-center gap-2">
                                <QuizSubmissionForm type="quizRating" quizRating={rating}>
                                    <Button>
                                        <Pen />
                                        {rating.is_rated ? 'Ganti ' : 'Beri '}
                                        Nilai
                                    </Button>
                                </QuizSubmissionForm>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
