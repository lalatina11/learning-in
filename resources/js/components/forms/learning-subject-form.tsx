import { learningSubjectSchema, LearningSubjectSchemaType, learningSubjectTypeEnum } from '@/lib/form-schema';
import { switchCaseLearningTypeForIndonesianLang } from '@/lib/switch-cases';
import { LearningSubject } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { ReactNode, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../animate-ui/components/radix/dialog';
import { Button } from '../ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface Props {
    children: ReactNode;
    type: 'create' | 'update' | 'delete';
    learningSubject?: LearningSubject;
}

interface ActionProps {
    handleCloseDialog: () => void;
    learningSubject?: LearningSubject;
}

export default function LearningSubjectForm({ children, type, learningSubject }: Props) {
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
                <Update handleCloseDialog={handleCloseDialog} learningSubject={learningSubject} />
            ) : (
                <Delete handleCloseDialog={handleCloseDialog} learningSubject={learningSubject} />
            )}
        </Dialog>
    );
}

function Create({ handleCloseDialog }: ActionProps) {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(learningSubjectSchema),
        defaultValues: { name: '', type: '' as LearningSubjectSchemaType['type'] },
    });

    function onSubmit(values: LearningSubjectSchemaType) {
        if (!learningSubjectTypeEnum.includes(values.type)) {
            return form.setError('type', { message: 'Mohon Pilih Tipe Pelajaran' });
        }
        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: (err: any) => {
                const errorMessage = err.server[0] || 'Terjadi kesalahan';
                form.setError('root', { message: errorMessage });

                toast.error(`Gagal Membuat Mata Pelajaran Baru`, {
                    description: errorMessage,
                    action: { label: 'OK', onClick: () => {} },
                });
            },
            onSuccess: () => {
                toast.success(`Berhasil Membuat Mata Pelajaran Baru`, {
                    action: { label: 'OK', onClick: () => {} },
                });
                form.reset();
                handleCloseDialog();
            },
        };
        router.post('/dashboard/admin/school/learning-subjects', values, requestOptions);
    }

    const isFormBusy = isLoading || form.formState.isLoading || form.formState.isSubmitting;

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Buat Mata Pelajaran</DialogTitle>
                <DialogDescription>Buat Mata Pelajaran baru</DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
                <FieldGroup>
                    <FieldError errors={[form.formState.errors.root]} />
                    <Controller
                        control={form.control}
                        name="name"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Nama</FieldLabel>
                                <Input {...field} id={field.name} aria-invalid={fieldState.invalid} autoComplete="off" />
                                <FieldError errors={[fieldState.error]} />
                            </Field>
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="type"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Tipe</FieldLabel>
                                <Select
                                    defaultValue={field.value || undefined}
                                    onValueChange={(val) => form.setValue('type', val as LearningSubjectSchemaType['type'])}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder={field.value || 'Pilih Tipe'} />
                                    </SelectTrigger>
                                    <SelectContent aria-invalid={fieldState.invalid}>
                                        <SelectGroup>
                                            {learningSubjectTypeEnum.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {switchCaseLearningTypeForIndonesianLang(type)}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
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
function Update({ handleCloseDialog, learningSubject }: ActionProps) {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(learningSubjectSchema),
        defaultValues: { name: learningSubject?.name || '', type: learningSubject?.type || ('' as LearningSubject['type']) },
    });

    function onSubmit(values: LearningSubjectSchemaType) {
        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: (err: any) => {
                console.log(err);

                const errorMessage = err.server[0] || 'Terjadi kesalahan';
                form.setError('root', { message: errorMessage });

                toast.error(`Gagal Mengubah Mata Pelajaran ini`, {
                    description: errorMessage,
                    action: { label: 'OK', onClick: () => {} },
                });
            },
            onSuccess: () => {
                toast.success(`Berhasil Mengubah Mata Pelajaran ini`, {
                    action: { label: 'OK', onClick: () => {} },
                });
                form.reset();
                handleCloseDialog();
            },
        };
        router.patch(`/dashboard/admin/school/learning-subjects/${learningSubject?.id}`, values, requestOptions);
    }

    const isFormBusy = isLoading || form.formState.isLoading || form.formState.isSubmitting;
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Update Mata Pelajaran</DialogTitle>
                <DialogDescription>Edit Mata Pelajaran </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
                <FieldGroup>
                    <FieldError errors={[form.formState.errors.root]} />
                    <Controller
                        control={form.control}
                        name="name"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Nama</FieldLabel>
                                <Input {...field} id={field.name} aria-invalid={fieldState.invalid} autoComplete="off" />
                                <FieldError errors={[fieldState.error]} />
                            </Field>
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="type"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Tipe</FieldLabel>
                                <Select
                                    defaultValue={field.value || undefined}
                                    onValueChange={(val) => form.setValue('type', val as LearningSubjectSchemaType['type'])}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder={field.value || 'Pilih Tipe'} />
                                    </SelectTrigger>
                                    <SelectContent aria-invalid={fieldState.invalid}>
                                        <SelectGroup>
                                            {learningSubjectTypeEnum.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {switchCaseLearningTypeForIndonesianLang(type)}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
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

function Delete({ learningSubject, handleCloseDialog }: ActionProps) {
    const [isLoading, setIsLoading] = useState(false);

    function handleDelete() {
        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: (err: any) => {
                console.log(err);

                const errorMessage = err.server[0] || 'Terjadi kesalahan';

                toast.error(`Gagal Menghapus Mata Pelajaran ini`, {
                    description: errorMessage,
                    action: { label: 'OK', onClick: () => {} },
                });
            },
            onSuccess: () => {
                toast.success(`Berhasil Menghapus Mata Pelajaran ini`, {
                    action: { label: 'OK', onClick: () => {} },
                });
                handleCloseDialog();
            },
        };
        router.delete(`/dashboard/admin/school/learning-subjects/${learningSubject?.id}`, requestOptions);
    }

    const isButtonBusy = isLoading;

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Hapus Mata Pelajaan</DialogTitle>
                <DialogDescription>Apakah anda yakin menghapus Mata Pelajaan ini? Tindakan ini tidak bisa dipulihkan</DialogDescription>
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
