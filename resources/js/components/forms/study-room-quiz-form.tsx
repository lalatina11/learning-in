import { quizSchema, QuizSchemaType } from '@/lib/form-schema';
import { Quiz } from '@/types/model-type';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { ReactNode, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '../animate-ui/components/buttons/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../animate-ui/components/radix/dialog';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { Spinner } from '../ui/spinner';

interface Props {
    children: ReactNode;
    type: 'create' | 'update' | 'delete' | 'switchClosed';
    studyRoomId?: number;
    quiz?: Quiz;
}

interface ActionProps {
    handleCloseDialog: () => void;
    studyRoomId?: number;
    quiz?: Quiz;
}

export default function StudyRoomQuizForm({ children, type, studyRoomId, quiz }: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    function handleCloseDialog() {
        setIsDialogOpen(false);
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            {type === 'create' ? (
                <Create handleCloseDialog={handleCloseDialog} studyRoomId={studyRoomId} />
            ) : type === 'update' ? (
                <Update handleCloseDialog={handleCloseDialog} quiz={quiz} />
            ) : type === 'delete' ? (
                <Delete handleCloseDialog={handleCloseDialog} quiz={quiz} />
            ) : (
                <SwitchClosed handleCloseDialog={handleCloseDialog} quiz={quiz} />
            )}
        </Dialog>
    );
}

function Create({ handleCloseDialog, studyRoomId }: ActionProps) {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(quizSchema),
        defaultValues: { platform: '', join_code: '' },
    });

    function onSubmit(values: QuizSchemaType) {
        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: (err: any) => {
                const errorMessage = err.server[0] || 'Terjadi kesalahan';
                form.setError('root', { message: errorMessage });

                toast.error(`Gagal membuat Quiz Baru`, {
                    description: errorMessage,
                    action: { label: 'OK', onClick: () => {} },
                });
            },
            onSuccess: () => {
                toast.success(`Berhasil membuat Quiz Baru`, {
                    action: { label: 'OK', onClick: () => {} },
                });
                form.reset();
                handleCloseDialog();
            },
        };
        router.post(`/dashboard/teacher/learning/quizzes/${studyRoomId}/create-quiz`, values, requestOptions);
    }

    const isFormBusy = isLoading || form.formState.isLoading || form.formState.isSubmitting;

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Buat Quiz</DialogTitle>
                <DialogDescription>Quiz Baru</DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
                <FieldGroup>
                    <FieldError errors={[form.formState.errors.root]} />
                    <FieldGroup>
                        <FieldError errors={[form.formState.errors.root]} />
                        <Controller
                            control={form.control}
                            name="platform"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Platform</FieldLabel>
                                    <Input {...field} id={field.name} autoComplete="off" />
                                    <FieldError errors={[fieldState.error]} />
                                    <FieldDescription>Platform Quiz yang digunakan</FieldDescription>
                                </Field>
                            )}
                        />
                        <Controller
                            control={form.control}
                            name="join_code"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Kode Gabung</FieldLabel>
                                    <Input {...field} id={field.name} autoComplete="off" />
                                    <FieldError errors={[fieldState.error]} />
                                    <FieldDescription>Kode Gabung atau Join Code</FieldDescription>
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </FieldGroup>
                <div className="flex justify-end gap-2">
                    <Button onClick={handleCloseDialog} type="button" variant={'outline'}>
                        Batal
                    </Button>
                    <Button disabled={isFormBusy} type="submit">
                        {isFormBusy ? <Spinner /> : 'Tambahkan'}
                    </Button>
                </div>
            </form>
        </DialogContent>
    );
}
function Update({ handleCloseDialog, quiz }: ActionProps) {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(quizSchema),
        defaultValues: { platform: quiz?.platform || '', join_code: quiz?.join_code || '' },
    });

    function onSubmit(values: QuizSchemaType) {
        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: (err: any) => {
                console.log(err);

                const errorMessage = err.server[0] || 'Terjadi kesalahan';
                form.setError('root', { message: errorMessage });

                toast.error(`Gagal Quiz ini`, {
                    description: errorMessage,
                    action: { label: 'OK', onClick: () => {} },
                });
            },
            onSuccess: () => {
                toast.success(`Berhasil Quiz ini`, {
                    action: { label: 'OK', onClick: () => {} },
                });
                form.reset();
                handleCloseDialog();
            },
        };
        router.patch(`/dashboard/teacher/learning/quizzes/${quiz?.id}/update-quiz`, values, requestOptions);
    }

    const isFormBusy = isLoading || form.formState.isLoading || form.formState.isSubmitting;
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Update Quiz</DialogTitle>
                <DialogDescription>Edit Quiz </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
                <FieldGroup>
                    <FieldError errors={[form.formState.errors.root]} />
                    <Controller
                        control={form.control}
                        name="platform"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Platform</FieldLabel>
                                <Input {...field} id={field.name} autoComplete="off" />
                                <FieldError errors={[fieldState.error]} />
                                <FieldDescription>Platform Quiz yang digunakan</FieldDescription>
                            </Field>
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="join_code"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Kode Gabung</FieldLabel>
                                <Input {...field} id={field.name} autoComplete="off" />
                                <FieldError errors={[fieldState.error]} />
                                <FieldDescription>Kode Gabung atau Join Code</FieldDescription>
                            </Field>
                        )}
                    />
                </FieldGroup>
                <div className="flex justify-end gap-2">
                    <Button onClick={handleCloseDialog} type="button" variant={'outline'}>
                        Batal
                    </Button>
                    <Button disabled={isFormBusy} type="submit">
                        {isFormBusy ? <Spinner /> : 'Update'}
                    </Button>
                </div>
            </form>
        </DialogContent>
    );
}

function Delete({ quiz, handleCloseDialog }: ActionProps) {
    const [isLoading, setIsLoading] = useState(false);

    function handleDelete() {
        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: (err: any) => {
                console.log(err);

                const errorMessage = err.server[0] || 'Terjadi kesalahan';

                toast.error(`Gagal Quiz ini`, {
                    description: errorMessage,
                    action: { label: 'OK', onClick: () => {} },
                });
            },
            onSuccess: () => {
                toast.success(`Berhasil Quiz ini`, {
                    action: { label: 'OK', onClick: () => {} },
                });
                handleCloseDialog();
            },
        };
        router.delete(`/dashboard/teacher/learning/quizzes/${quiz?.id}/delete-quiz`, requestOptions);
    }

    const isButtonBusy = isLoading;

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Hapus Quiz</DialogTitle>
                <DialogDescription>Apakah anda yakin menghapus Quiz ini? Tindakan ini tidak bisa dipulihkan</DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2">
                <Button type="button" variant={'outline'}>
                    Batal
                </Button>
                <Button disabled={isButtonBusy} onClick={handleDelete} type="submit">
                    {isButtonBusy ? <Spinner /> : 'Hapus'}
                </Button>
            </div>
        </DialogContent>
    );
}

function SwitchClosed({ quiz, handleCloseDialog }: ActionProps) {
    const [isLoading, setIsLoading] = useState(false);

    function handleSwitch() {
        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: (err: any) => {
                console.log(err);

                const errorMessage = err.server[0] || 'Terjadi kesalahan';

                toast.error(`Gagal mengganti status Quiz ini`, {
                    description: errorMessage,
                    action: { label: 'OK', onClick: () => {} },
                });
            },
            onSuccess: () => {
                toast.success(`Berhasil mengganti status Quiz ini`, {
                    action: { label: 'OK', onClick: () => {} },
                });
                handleCloseDialog();
            },
        };
        router.patch(`/dashboard/teacher/learning/quizzes/${quiz?.id}/switch-quiz-status`, {}, requestOptions);
    }

    const isButtonBusy = isLoading;

    const isClosed = !quiz?.is_open;

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{isClosed ? 'Buka' : 'Tutup'} Quiz</DialogTitle>
                <DialogDescription>
                    Apakah anda yakin {isClosed ? 'Membuka' : 'Menutup'} Quiz ini?{' '}
                    {isClosed ? 'Jika dibuka, siswa diperbolehkan untuk mengikuti' : 'Jika ditutup, siswa tidak diperbolehkan untuk mengikuti'}
                </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2">
                <Button onClick={handleCloseDialog} type="button" variant={'outline'}>
                    Batal
                </Button>
                <Button disabled={isButtonBusy} variant={isClosed ? 'default' : 'destructive'} onClick={handleSwitch} type="submit">
                    {isButtonBusy ? <Spinner /> : isClosed && !isButtonBusy ? 'Buka' : !isClosed && !isButtonBusy ? 'Tutup' : ''}
                </Button>
            </div>
        </DialogContent>
    );
}
