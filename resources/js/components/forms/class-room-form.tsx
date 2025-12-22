import { classRoomSchema, ClassRoomSchemaType, gradeEnum } from '@/lib/form-schema';
import { ClassRoomWithMajor, Major } from '@/types';
import { PageProps } from '@/types/page-props';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, usePage } from '@inertiajs/react';
import { ReactNode, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../animate-ui/components/radix/dialog';
import { Button } from '../ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface Props {
    children: ReactNode;
    type: 'create' | 'update' | 'delete';
    classRoom?: ClassRoomWithMajor;
}

interface ActionProps {
    handleCloseDialog: () => void;
    classRoom?: ClassRoomWithMajor;
}

export default function ClassRoomForm({ children, type, classRoom }: Props) {
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
                <Update handleCloseDialog={handleCloseDialog} classRoom={classRoom} />
            ) : (
                <Delete handleCloseDialog={handleCloseDialog} classRoom={classRoom} />
            )}
        </Dialog>
    );
}

function Create({ handleCloseDialog }: ActionProps) {
    const { majors } = usePage().props as PageProps & { majors: Array<Major> };
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(classRoomSchema),
        defaultValues: { major_id: 0, grade: 'X' as ClassRoomSchemaType['grade'] },
    });

    function onSubmit(values: ClassRoomSchemaType) {
        const majorIds = majors.map((major) => major.id);
        if (!majorIds.includes(values.major_id) && !gradeEnum.includes(values.grade)) {
            form.setError('grade', { message: 'Mohon isi jurusan dengan benar' });
            return form.setError('grade', { message: 'Mohon isi tingkatan dengan benar' });
        }
        if (!majorIds.includes(values.major_id)) {
            return form.setError('grade', { message: 'Mohon isi jurusan dengan benar' });
        }
        if (!gradeEnum.includes(values.grade)) {
            return form.setError('grade', { message: 'Mohon isi tingkatan dengan benar' });
        }
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
        router.post('/dashboard/admin/school/class-room', values, requestOptions);
    }

    const isFormBusy = isLoading || form.formState.isLoading || form.formState.isSubmitting;

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Buat Kelas</DialogTitle>
                <DialogDescription>Buat Kelas baru</DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
                <FieldGroup>
                    <FieldError errors={[form.formState.errors.root]} />
                    <Controller
                        control={form.control}
                        name="major_id"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Jurusan</FieldLabel>
                                <Select onValueChange={(val) => form.setValue('major_id', Number(val))}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Pilih Jurusan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {majors.map((major) => (
                                                <SelectItem key={major.id} value={major.id.toString()}>
                                                    {major.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FieldError errors={[fieldState.error]} />
                            </Field>
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="grade"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Tingkatan</FieldLabel>
                                <Select
                                    defaultValue={field.value || undefined}
                                    onValueChange={(val) => form.setValue('grade', val as ClassRoomSchemaType['grade'])}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder={field.value || 'Pilih Tingkatan'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {gradeEnum.map((grade) => (
                                                <SelectItem key={grade} value={grade}>
                                                    {grade}
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
function Update({ handleCloseDialog, classRoom }: ActionProps) {
    const { majors } = usePage().props as PageProps & { majors: Array<Major> };

    const [isLoading, setIsLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(classRoomSchema),
        defaultValues: { major_id: classRoom?.major_id || '', grade: classRoom?.grade || ('X' as ClassRoomSchemaType['grade']) },
    });

    function onSubmit(values: ClassRoomSchemaType) {
        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: (err: any) => {
                console.log(err);

                const errorMessage = err.server[0] || 'Terjadi kesalahan';
                form.setError('root', { message: errorMessage });

                toast.error(`Gagal Mengubah Kelas ini`, {
                    description: errorMessage,
                    action: { label: 'OK', onClick: () => {} },
                });
            },
            onSuccess: () => {
                toast.success(`Berhasil Mengubah Kelas ini`, {
                    action: { label: 'OK', onClick: () => {} },
                });
                form.reset();
                handleCloseDialog();
            },
        };
        router.patch(`/dashboard/admin/school/class-room/${classRoom?.id}`, values, requestOptions);
    }

    const isFormBusy = isLoading || form.formState.isLoading || form.formState.isSubmitting;
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Update Kelas</DialogTitle>
                <DialogDescription>Edit Kelas </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
                <FieldGroup>
                    <FieldError errors={[form.formState.errors.root]} />
                    <Controller
                        control={form.control}
                        name="major_id"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Jurusan</FieldLabel>
                                <Select
                                    defaultValue={Number(form.getValues().major_id).toString() || undefined}
                                    onValueChange={(val) => form.setValue('major_id', Number(val))}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder={majors.find((major) => major.id === field.value)?.name || 'Pilih Jurusan'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {majors.map((major) => (
                                                <SelectItem key={major.id} value={major.id.toString()}>
                                                    {major.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FieldError errors={[fieldState.error]} />
                            </Field>
                        )}
                    />
                    <Controller
                        control={form.control}
                        name="grade"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Tingkatan</FieldLabel>
                                <Select
                                    defaultValue={classRoom?.grade.toString() || undefined}
                                    onValueChange={(val) => form.setValue('grade', val as ClassRoomSchemaType['grade'])}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder={classRoom?.grade || 'Pilih Tingkatan'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {gradeEnum.map((grade) => (
                                                <SelectItem key={grade} value={grade}>
                                                    {grade}
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

function Delete({ classRoom, handleCloseDialog }: ActionProps) {
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
        router.delete(`/dashboard/admin/school/class-room/${classRoom?.id}`, requestOptions);
    }

    const isButtonBusy = isLoading;

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Hapus Jurusan</DialogTitle>
                <DialogDescription>Apakah anda yakin menghapus jurusan ini? Tindakan ini tidak bisa dipulihkan</DialogDescription>
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
