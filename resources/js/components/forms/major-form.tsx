import { majorSchema, MajorSchemaType } from '@/lib/form-schema';
import { Major } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { ReactNode, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../animate-ui/components/radix/dialog';
import { Button } from '../ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';

interface Props {
    children: ReactNode;
    type: 'create' | 'update' | 'delete';
    major?: Major;
}

interface ActionProps {
    handleCloseDialog: () => void;
    major?: Major;
}

export default function CreateOrUpdateOrDeleteMajorForm({ children, type, major }: Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    function handleCloseDialog() {
        setIsDialogOpen(false);
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            {type === 'create' ? (
                <Create handleCloseDialog={handleCloseDialog} />
            ) : type === 'update' ? (
                <Update handleCloseDialog={handleCloseDialog} major={major} />
            ) : (
                <Delete handleCloseDialog={handleCloseDialog} major={major} />
            )}
        </Dialog>
    );
}

function Create({ handleCloseDialog }: ActionProps) {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(majorSchema),
        defaultValues: { name: '' },
    });

    function onSubmit(values: MajorSchemaType) {
        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: (err: any) => {
                const errorMessage = err.server[0] || 'Terjadi kesalahan';
                form.setError('root', { message: errorMessage });

                toast.error(`Gagal Membuat Jurusan Baru`, {
                    description: errorMessage,
                    action: { label: 'OK', onClick: () => {} },
                });
            },
            onSuccess: () => {
                toast.success(`Berhasil Membuat Jurusan Baru`, {
                    action: { label: 'OK', onClick: () => {} },
                });
                form.reset();
                handleCloseDialog();
            },
        };
        router.post('/dashboard/admin/school/majors', values, requestOptions);
    }

    const isFormBusy = isLoading || form.formState.isLoading || form.formState.isSubmitting;

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add Major</DialogTitle>
                <DialogDescription>Add new Major</DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
                <FieldGroup>
                    <FieldError errors={[form.formState.errors.root]} />
                    <Controller
                        control={form.control}
                        name="name"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                                <Input {...field} id={field.name} autoComplete="off" />
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
                        Tambahkan
                    </Button>
                </div>
            </form>
        </DialogContent>
    );
}
function Update({ handleCloseDialog, major }: ActionProps) {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(majorSchema),
        defaultValues: { name: major?.name || '' },
    });

    function onSubmit(values: MajorSchemaType) {
        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: (err: any) => {
                console.log(err);

                const errorMessage = err.server[0] || 'Terjadi kesalahan';
                form.setError('root', { message: errorMessage });

                toast.error(`Gagal Mengubah Jurusan ini`, {
                    description: errorMessage,
                    action: { label: 'OK', onClick: () => {} },
                });
            },
            onSuccess: () => {
                toast.success(`Berhasil Mengubah Jurusan ini`, {
                    action: { label: 'OK', onClick: () => {} },
                });
                form.reset();
                handleCloseDialog();
            },
        };
        router.patch(`/dashboard/admin/school/majors/${major?.id}`, values, requestOptions);
    }

    const isFormBusy = isLoading || form.formState.isLoading || form.formState.isSubmitting;
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Update Jurusan</DialogTitle>
                <DialogDescription>Edit Jurusan </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
                <FieldGroup>
                    <FieldError errors={[form.formState.errors.root]} />
                    <Controller
                        control={form.control}
                        name="name"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                                <Input {...field} id={field.name} autoComplete="off" />
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

function Delete({ major, handleCloseDialog }: ActionProps) {
    const [isLoading, setIsLoading] = useState(false);

    function handleDelete() {
        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: (err: any) => {
                console.log(err);

                const errorMessage = err.server[0] || 'Terjadi kesalahan';

                toast.error(`Gagal Menghapus Jurusan ini`, {
                    description: errorMessage,
                    action: { label: 'OK', onClick: () => {} },
                });
            },
            onSuccess: () => {
                toast.success(`Berhasil Menghapus Jurusan ini`, {
                    action: { label: 'OK', onClick: () => {} },
                });
                handleCloseDialog();
            },
        };
        router.delete(`/dashboard/admin/school/majors/${major?.id}`, requestOptions);
    }

    const isButtonBusy = isLoading;

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Hapus Jurusan</DialogTitle>
                <DialogDescription>Apakah anda yakin menghapus jurusan ini? Tindakan ini tidak bisa dipulihkan</DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2">
                <Button type="button" variant={'outline'}>
                    Batal
                </Button>
                <Button disabled={isButtonBusy} onClick={handleDelete} type="submit">
                    Hapus
                </Button>
            </div>
        </DialogContent>
    );
}
