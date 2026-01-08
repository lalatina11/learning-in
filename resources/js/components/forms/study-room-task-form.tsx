import { studyRoomTaskSchema, StudyRoomTaskSchemaType, studyRoomTaskSubmissionSchema, StudyRoomTaskSubmissionSchemaType } from '@/lib/form-schema';
import { StudyRoomTask } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { ChangeEvent, ReactNode, useState } from 'react';
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
    type: 'create' | 'update' | 'delete' | 'switchClosed' | 'submission';
    studyRoomId?: number;
    task?: StudyRoomTask;
}

interface ActionProps {
    handleCloseDialog: () => void;
    studyRoomId?: number;
    task?: StudyRoomTask;
}

export default function StudyRoomTaskForm({ children, type, studyRoomId, task }: Props) {
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
                <Update handleCloseDialog={handleCloseDialog} task={task} />
            ) : type === 'delete' ? (
                <Delete handleCloseDialog={handleCloseDialog} task={task} />
            ) : type === 'submission' ? (
                <Submission handleCloseDialog={handleCloseDialog} task={task} />
            ) : (
                <SwitchClosed handleCloseDialog={handleCloseDialog} task={task} />
            )}
        </Dialog>
    );
}

function Create({ handleCloseDialog, studyRoomId }: ActionProps) {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(studyRoomTaskSchema),
        defaultValues: { description: '', task: undefined },
    });

    function handleChangeTaskFile(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        form.setValue('task', file);
    }

    function onSubmit(values: StudyRoomTaskSchemaType) {
        if (!values.task) {
            return form.setError('task', { message: 'Tugas tidak boleh kosong' });
        }
        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: (err: any) => {
                const errorMessage = err.server[0] || 'Terjadi kesalahan';
                form.setError('root', { message: errorMessage });

                toast.error(`Gagal Membuat Tugas Pembelajaran Baru`, {
                    description: errorMessage,
                    action: { label: 'OK', onClick: () => {} },
                });
            },
            onSuccess: () => {
                toast.success(`Berhasil Membuat Tugas Pembelajaran Baru`, {
                    action: { label: 'OK', onClick: () => {} },
                });
                form.reset();
                handleCloseDialog();
            },
        };
        router.post(`/dashboard/teacher/learning/tasks/${studyRoomId}/create-study-room-task`, values, requestOptions);
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
                        name="description"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Deskripsi</FieldLabel>
                                <Textarea {...field} id={field.name} />
                                <FieldError errors={[fieldState.error]} />
                                <FieldDescription>Deskripsi wajib diisi</FieldDescription>
                            </Field>
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="task"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Tugas</FieldLabel>
                                <Input type="file" onChange={handleChangeTaskFile} id={field.name} />
                                <FieldError errors={[fieldState.error]} />
                                <FieldDescription>Tugas wajib diisi</FieldDescription>
                            </Field>
                        )}
                    />
                </FieldGroup>
                <div className="flex justify-end gap-2">
                    <Button onClick={handleCloseDialog} disabled={isLoading} type="button" variant={'outline'}>
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

function Update({ handleCloseDialog, task }: ActionProps) {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(studyRoomTaskSchema),
        defaultValues: { description: task?.description || '', task: undefined },
    });

    function handleChangeInputModuleFile(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        form.setValue('task', file);
    }

    function onSubmit(values: StudyRoomTaskSchemaType) {
        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: (err: any) => {
                console.log(err);

                const errorMessage = err.server[0] || 'Terjadi kesalahan';
                form.setError('root', { message: errorMessage });

                toast.error(`Gagal Mengubah Tugas ini`, {
                    description: errorMessage,
                    action: { label: 'OK', onClick: () => {} },
                });
            },
            onSuccess: () => {
                toast.success(`Berhasil Mengubah Tugas ini`, {
                    action: { label: 'OK', onClick: () => {} },
                });
                form.reset();
                handleCloseDialog();
            },
        };
        router.patch(`/dashboard/teacher/learning/tasks/${task?.id}/update-study-room-task`, values, requestOptions);
    }

    const isFormBusy = isLoading || form.formState.isLoading || form.formState.isSubmitting;
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Update Tugas</DialogTitle>
                <DialogDescription>Edit Tugas </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
                <FieldGroup>
                    <FieldError errors={[form.formState.errors.root]} />
                    <Controller
                        control={form.control}
                        name="description"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Deksripsi</FieldLabel>
                                <Textarea {...field} id={field.name} defaultValue={task?.description} />
                                <FieldError errors={[fieldState.error]} />
                            </Field>
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="task"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Tugas</FieldLabel>
                                <Input type="file" onChange={handleChangeInputModuleFile} id={field.name} />
                                <FieldDescription>Tugas boleh kosong</FieldDescription>
                                <FieldError errors={[fieldState.error]} />
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

function Delete({ task, handleCloseDialog }: ActionProps) {
    const [isLoading, setIsLoading] = useState(false);

    function handleDelete() {
        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: (err: any) => {
                console.log(err);

                const errorMessage = err.server[0] || 'Terjadi kesalahan';

                toast.error(`Gagal Menghapus Tugas ini`, {
                    description: errorMessage,
                    action: { label: 'OK', onClick: () => {} },
                });
            },
            onSuccess: () => {
                toast.success(`Berhasil Menghapus Tugas ini`, {
                    action: { label: 'OK', onClick: () => {} },
                });
                handleCloseDialog();
            },
        };
        router.delete(`/dashboard/teacher/learning/tasks/${task?.id}/delete-study-room-task`, requestOptions);
    }

    const isButtonBusy = isLoading;

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Hapus Tugas</DialogTitle>
                <DialogDescription>Apakah anda yakin menghapus Tugas ini? Tindakan ini tidak bisa dipulihkan</DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2">
                <Button onClick={handleCloseDialog} type="button" variant={'outline'}>
                    Batal
                </Button>
                <Button disabled={isButtonBusy} onClick={handleDelete} type="submit">
                    {isButtonBusy ? <Spinner /> : 'Hapus'}
                </Button>
            </div>
        </DialogContent>
    );
}

function SwitchClosed({ task, handleCloseDialog }: ActionProps) {
    const [isLoading, setIsLoading] = useState(false);

    function handleSwitch() {
        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: (err: any) => {
                console.log(err);

                const errorMessage = err.server[0] || 'Terjadi kesalahan';

                toast.error(`Gagal mengganti status Tugas Pembelajaran ini`, {
                    description: errorMessage,
                    action: { label: 'OK', onClick: () => {} },
                });
            },
            onSuccess: () => {
                toast.success(`Berhasil mengganti status Tugas Pembelajaran ini`, {
                    action: { label: 'OK', onClick: () => {} },
                });
                handleCloseDialog();
            },
        };
        router.patch(`/dashboard/teacher/learning/tasks/${task?.id}/switch-study-room-task-status`, {}, requestOptions);
    }

    const isButtonBusy = isLoading;

    const isClosed = task?.is_closed;

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{isClosed ? 'Buka' : 'Tutup'} Tugas Pembelajaran</DialogTitle>
                <DialogDescription>
                    Apakah anda yakin {isClosed ? 'Membuka' : 'Menutup'} Tugas Pembelajaran ini?{' '}
                    {isClosed
                        ? 'Jika dibuka, siswa diperbolehkan untuk submit tugas lagi'
                        : 'Jika ditutup, siswa tidak diperbolehkan untuk submit tugas lagi'}
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

function Submission({ handleCloseDialog, task }: ActionProps) {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(studyRoomTaskSubmissionSchema),
        defaultValues: { url: '' },
    });

    function onSubmit(values: StudyRoomTaskSubmissionSchemaType) {
        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: (err: any) => {
                console.log(err);

                const errorMessage = err.server[0] || 'Terjadi kesalahan';
                form.setError('root', { message: errorMessage });

                toast.error(`Gagal mengerjakan tugas pada tugas ini`, {
                    description: errorMessage,
                    action: { label: 'OK', onClick: () => {} },
                });
            },
            onSuccess: () => {
                toast.success(`Berhasil mengerjakan tugas pada tugas ini`, {
                    action: { label: 'OK', onClick: () => {} },
                });
                form.reset();
                handleCloseDialog();
            },
        };
        router.patch(`/dashboard/learning/tasks/${task?.id}/task-submissions`, values, requestOptions);
    }

    const isFormBusy = isLoading || form.formState.isLoading || form.formState.isSubmitting;

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Kerjakan Tugas</DialogTitle>
                <DialogDescription>Kerjakan Tugas</DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
                <FieldGroup>
                    <FieldError errors={[form.formState.errors.root]} />
                    <Controller
                        control={form.control}
                        name="url"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Link</FieldLabel>
                                <Textarea {...field} id={field.name} defaultValue={task?.description} />
                                <FieldError errors={[fieldState.error]} />
                                <FieldDescription>Minimal 5 karakter, berisi link hasil tugas seperti link drive atau sejenisnya.</FieldDescription>
                            </Field>
                        )}
                    />
                </FieldGroup>
                <div className="flex justify-end gap-2">
                    <Button onClick={handleCloseDialog} type="button" variant={'outline'}>
                        Batal
                    </Button>
                    <Button disabled={isFormBusy} type="submit">
                        {isFormBusy ? <Spinner /> : 'Submit'}
                    </Button>
                </div>
            </form>
        </DialogContent>
    );
}
