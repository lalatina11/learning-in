import { studyRoomTaskSubmissionSchema, StudyRoomTaskSubmissionSchemaType } from '@/lib/form-schema';
import { TaskSubmissionsWithStudent } from '@/pages/dashboard/teacher/learning/details';
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
    type: 'taskRating';
    taskSubmission?: TaskSubmissionsWithStudent;
}

interface ActionProps {
    handleCloseDialog: () => void;
    taskSubmission?: TaskSubmissionsWithStudent;
}

export default function TaskSubmissionForm({ children, type, taskSubmission }: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    function handleCloseDialog() {
        setIsDialogOpen(false);
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            {type === 'taskRating' && <TaskRating taskSubmission={taskSubmission} handleCloseDialog={handleCloseDialog} />}
        </Dialog>
    );
}

function TaskRating({ handleCloseDialog, taskSubmission }: ActionProps) {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(studyRoomTaskSubmissionSchema),
        defaultValues: { rate: taskSubmission?.rate || 0, teacher_note: taskSubmission?.teacher_note || '' },
    });

    function onSubmit(values: StudyRoomTaskSubmissionSchemaType) {
        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: (err: any) => {
                const errorMessage = err.server[0] || 'Terjadi kesalahan';
                form.setError('root', { message: errorMessage });

                toast.error(`Gagal Menilai Pekerjaan siswa ini`, {
                    description: errorMessage,
                    action: { label: 'OK', onClick: () => {} },
                });
            },
            onSuccess: () => {
                toast.success(`Berhasil Menilai Pekerjaan siswa ini`, {
                    action: { label: 'OK', onClick: () => {} },
                });
                form.reset();
                handleCloseDialog();
            },
        };
        router.post(`/dashboard/teacher/learning/tasks-submission/${taskSubmission?.id}/rating-task-submission`, values, requestOptions);
    }

    const isFormBusy = isLoading || form.formState.isLoading || form.formState.isSubmitting;

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Buat Tugas</DialogTitle>
                <DialogDescription>Buat Tugas baru</DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
                <FieldGroup>
                    <FieldError errors={[form.formState.errors.root]} />
                    <Controller
                        control={form.control}
                        name="rate"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Deskripsi</FieldLabel>
                                <Input
                                    defaultValue={Number(form.getValues('rate'))}
                                    value={Number(form.getValues('rate'))}
                                    onChange={(e) => form.setValue('rate', Number(e.currentTarget.value))}
                                    id={field.name}
                                    type="number"
                                />
                                <FieldError errors={[fieldState.error]} />
                                <FieldDescription>Catatan Guru boleh kosong</FieldDescription>
                            </Field>
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="teacher_note"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Deskripsi</FieldLabel>
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
