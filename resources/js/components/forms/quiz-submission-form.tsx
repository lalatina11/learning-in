import { studyRoomTaskSubmissionSchema, StudyRoomTaskSubmissionSchemaType } from '@/lib/form-schema';
import { QuizRating as QuizRatingType } from '@/types/model-type';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { ReactNode, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../animate-ui/components/radix/dialog';
import { Button } from '../ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { Spinner } from '../ui/spinner';
import { Textarea } from '../ui/textarea';

interface Props {
    children: ReactNode;
    type: 'quizRating';
    quizRating?: QuizRatingType;
}

interface ActionProps {
    handleCloseDialog: () => void;
    quizRating?: QuizRatingType;
}

export default function QuizSubmissionForm({ children, type, quizRating }: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    function handleCloseDialog() {
        setIsDialogOpen(false);
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            {type === 'quizRating' && <QuizRating quizRating={quizRating} handleCloseDialog={handleCloseDialog} />}
        </Dialog>
    );
}

function QuizRating({ handleCloseDialog, quizRating }: ActionProps) {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(studyRoomTaskSubmissionSchema),
        defaultValues: { rate: quizRating?.rate, teacher_note: quizRating?.teacher_note || '' },
    });

    function onSubmit(values: StudyRoomTaskSubmissionSchemaType) {
        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: (err: any) => {
                const errorMessage = err.server[0] || 'Terjadi kesalahan';
                form.setError('root', { message: errorMessage });

                toast.error(`Gagal Menilai Quiz siswa ini`, {
                    description: errorMessage,
                    action: { label: 'OK', onClick: () => {} },
                });
            },
            onSuccess: () => {
                toast.success(`Berhasil Menilai Quiz siswa ini`, {
                    action: { label: 'OK', onClick: () => {} },
                });
                form.reset();
                handleCloseDialog();
            },
        };
        router.patch(`/dashboard/teacher/learning/quizzes/${quizRating?.id}/${quizRating?.student_id}/rating-quiz`, values, requestOptions);
    }

    const isFormBusy = isLoading || form.formState.isLoading || form.formState.isSubmitting;

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Beri Penilaian</DialogTitle>
                <DialogDescription>Beri Penilaian pada Quiz</DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
                <FieldGroup>
                    <FieldError errors={[form.formState.errors.root]} />
                    <Controller
                        control={form.control}
                        name="rate"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Nilai</FieldLabel>
                                <Input
                                    defaultValue={Number(form.getValues('rate'))}
                                    value={Number(form.getValues('rate'))}
                                    onChange={(e) => form.setValue('rate', Number(e.currentTarget.value))}
                                    id={field.name}
                                    type="number"
                                />
                                <FieldError errors={[fieldState.error]} />
                            </Field>
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="teacher_note"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Catatan Guru</FieldLabel>
                                <Textarea {...field} id={field.name} />
                                <FieldError errors={[fieldState.error]} />
                                <FieldDescription>Catatan Guru boleh kosong</FieldDescription>
                            </Field>
                        )}
                    />
                </FieldGroup>
                <div className="flex justify-end gap-2">
                    <Button onClick={handleCloseDialog} disabled={isLoading} type="button" variant={'outline'}>
                        Batal
                    </Button>
                    <Button disabled={isFormBusy} type="submit">
                        {isFormBusy ? <Spinner /> : 'Beri Nilai'}
                    </Button>
                </div>
            </form>
        </DialogContent>
    );
}
