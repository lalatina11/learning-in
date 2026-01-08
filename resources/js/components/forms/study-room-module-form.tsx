import { studyRoomModuleSchema, type StudyRoomModuleSchemaType } from '@/lib/form-schema';
import { StudyRoomModule } from '@/types';
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
    type: 'create' | 'update' | 'delete';
    studyRoomId?: number;
    module?: StudyRoomModule;
}

interface ActionProps {
    handleCloseDialog: () => void;
    studyRoomId?: number;
    module?: StudyRoomModule;
}

export default function StudyRoomModuleForm({ children, type, studyRoomId, module }: Props) {
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
                <Update handleCloseDialog={handleCloseDialog} module={module} />
            ) : (
                <Delete handleCloseDialog={handleCloseDialog} module={module} />
            )}
        </Dialog>
    );
}

function Create({ handleCloseDialog, studyRoomId }: ActionProps) {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(studyRoomModuleSchema),
        defaultValues: { description: '', module: undefined },
    });

    function handleChangeInputModuleFile(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        form.setValue('module', file);
    }

    function onSubmit(values: StudyRoomModuleSchemaType) {
        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: (err: any) => {
                const errorMessage = err.server[0] || 'Terjadi kesalahan';
                form.setError('root', { message: errorMessage });

                toast.error(`Gagal Membuat Module Pembelajaran Baru`, {
                    description: errorMessage,
                    action: { label: 'OK', onClick: () => {} },
                });
            },
            onSuccess: () => {
                toast.success(`Berhasil Membuat Module Pembelajaran Baru`, {
                    action: { label: 'OK', onClick: () => {} },
                });
                form.reset();
                handleCloseDialog();
            },
        };
        router.post(`/dashboard/teacher/learning/modules/${studyRoomId}/create-study-room-module`, values, requestOptions);
    }

    const isFormBusy = isLoading || form.formState.isLoading || form.formState.isSubmitting;

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Buat Module Pembelajaran</DialogTitle>
                <DialogDescription>Buat Module Pembelajaran baru</DialogDescription>
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
                        name="module"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Module</FieldLabel>
                                <Input type="file" onChange={handleChangeInputModuleFile} id={field.name} />
                                <FieldError errors={[fieldState.error]} />
                                <FieldDescription>Module wajib diisi</FieldDescription>
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

function Update({ handleCloseDialog, module }: ActionProps) {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(studyRoomModuleSchema),
        defaultValues: { description: module?.description || '', module: undefined },
    });

    function handleChangeInputModuleFile(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        form.setValue('module', file);
    }

    function onSubmit(values: StudyRoomModuleSchemaType) {
        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: (err: any) => {
                console.log(err);

                const errorMessage = err.server[0] || 'Terjadi kesalahan';
                form.setError('root', { message: errorMessage });

                toast.error(`Gagal Mengubah Module Pembelajaran ini`, {
                    description: errorMessage,
                    action: { label: 'OK', onClick: () => {} },
                });
            },
            onSuccess: () => {
                toast.success(`Berhasil Mengubah Module Pembelajaran ini`, {
                    action: { label: 'OK', onClick: () => {} },
                });
                form.reset();
                handleCloseDialog();
            },
        };
        router.patch(`/dashboard/teacher/learning/modules/${module?.id}/update-study-room-module`, values, requestOptions);
    }

    const isFormBusy = isLoading || form.formState.isLoading || form.formState.isSubmitting;
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Update Module</DialogTitle>
                <DialogDescription>Edit Module </DialogDescription>
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
                                <Textarea {...field} id={field.name} defaultValue={module?.description} />
                                <FieldError errors={[fieldState.error]} />
                            </Field>
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="module"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Module</FieldLabel>
                                <Input type="file" onChange={handleChangeInputModuleFile} id={field.name} />
                                <FieldDescription>Module boleh kosong</FieldDescription>
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

function Delete({ module, handleCloseDialog }: ActionProps) {
    const [isLoading, setIsLoading] = useState(false);

    function handleDelete() {
        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: (err: any) => {
                console.log(err);

                const errorMessage = err.server[0] || 'Terjadi kesalahan';

                toast.error(`Gagal Menghapus Module Pembelajaran ini`, {
                    description: errorMessage,
                    action: { label: 'OK', onClick: () => {} },
                });
            },
            onSuccess: () => {
                toast.success(`Berhasil Menghapus Module Pembelajaran ini`, {
                    action: { label: 'OK', onClick: () => {} },
                });
                handleCloseDialog();
            },
        };
        router.delete(`/dashboard/teacher/learning/modules/${module?.id}/delete-study-room-module`, requestOptions);
    }

    const isButtonBusy = isLoading;

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Hapus Module Pembelajaran</DialogTitle>
                <DialogDescription>Apakah anda yakin menghapus Module Pembelajaran ini? Tindakan ini tidak bisa dipulihkan</DialogDescription>
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
