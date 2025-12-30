import { learningModuleSchema, LearningModuleSchemaType } from '@/lib/form-schema';
import { LearningModule } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { ChangeEvent, ReactNode, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../animate-ui/components/radix/dialog';
import { Button } from '../ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

interface Props {
    children: ReactNode;
    type: 'create' | 'update' | 'delete';
    studyRoomId?: number;
    learningModule?: LearningModule;
}

interface ActionProps {
    handleCloseDialog: () => void;
    studyRoomId?: number;
    learningModule?: LearningModule;
}

export default function LearningModuleForm({ children, type, studyRoomId, learningModule }: Props) {
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
                <Update handleCloseDialog={handleCloseDialog} learningModule={learningModule} />
            ) : (
                <Delete handleCloseDialog={handleCloseDialog} learningModule={learningModule} />
            )}
        </Dialog>
    );
}

function Create({ handleCloseDialog, studyRoomId }: ActionProps) {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(learningModuleSchema),
        defaultValues: { description: '', module: undefined },
    });

    function handleChangeInputModuleFile(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        form.setValue('module', file);
    }

    function onSubmit(values: LearningModuleSchemaType) {
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
        router.post(`/dashboard/teacher/learning/${studyRoomId}/create-learning-module`, values, requestOptions);
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
                        Tambahkan
                    </Button>
                </div>
            </form>
        </DialogContent>
    );
}

function Update({ handleCloseDialog, learningModule }: ActionProps) {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(learningModuleSchema),
        defaultValues: { description: learningModule?.description || '', module: undefined },
    });

    function handleChangeInputModuleFile(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        form.setValue('module', file);
    }

    function onSubmit(values: LearningModuleSchemaType) {
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
        router.patch(`/dashboard/teacher/learning/${learningModule?.id}/update-learning-module`, values, requestOptions);
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
                                <Textarea {...field} id={field.name} defaultValue={learningModule?.description} />
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
                        Update
                    </Button>
                </div>
            </form>
        </DialogContent>
    );
}

function Delete({ learningModule, handleCloseDialog }: ActionProps) {
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
        router.delete(`/dashboard/teacher/learning/${learningModule?.id}/delete-learning-module`, requestOptions);
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
                    Hapus
                </Button>
            </div>
        </DialogContent>
    );
}
