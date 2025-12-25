import { LearningSubjectSchemaType, studentInTheStudyRoomSchema, StudentInTheStudyRoomSchemaType } from '@/lib/form-schema';
import { User } from '@/types';
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
    studyRoomId: number;
    user?: User;
}

interface ActionProps {
    handleCloseDialog: () => void;
    studyRoomId: number;
    user?: User;
}

export default function StudentInTheStudyRoomForm({ children, type, studyRoomId, user }: Props) {
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
                <Update handleCloseDialog={handleCloseDialog} studyRoomId={studyRoomId} user={user} />
            ) : (
                <Delete handleCloseDialog={handleCloseDialog} studyRoomId={studyRoomId} user={user} />
            )}
        </Dialog>
    );
}

function Create({ handleCloseDialog, studyRoomId }: ActionProps) {
    const { studentList } = usePage().props as PageProps & { studentList: Array<User> };
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(studentInTheStudyRoomSchema),
        defaultValues: { user_id: 0 },
    });

    function onSubmit(values: StudentInTheStudyRoomSchemaType) {
        const studenIds = studentList.map((student) => student.id);
        if (!studenIds.includes(values.user_id)) {
            return form.setError('user_id', { message: 'Mohon Pilih Tipe Pelajaran' });
        }
        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: (err: any) => {
                const errorMessage = err.server[0] || 'Terjadi kesalahan';
                form.setError('root', { message: errorMessage });

                toast.error(`Gagal menambahkan siswa ke KBM`, {
                    description: errorMessage,
                    action: { label: 'OK', onClick: () => {} },
                });
            },
            onSuccess: () => {
                toast.success(`Berhasil menambahkan siswa ke KBM`, {
                    action: { label: 'OK', onClick: () => {} },
                });
                form.reset();
                handleCloseDialog();
            },
        };
        router.patch(`/dashboard/admin/school/study-room/${studyRoomId}/add-student`, values, requestOptions);
    }

    const isFormBusy = isLoading || form.formState.isLoading || form.formState.isSubmitting;

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Tambahkan Murid</DialogTitle>
                <DialogDescription>Tambahkan Murid di KBM ini</DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
                <FieldGroup>
                    <FieldError errors={[form.formState.errors.root]} />
                    <Controller
                        control={form.control}
                        name="user_id"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Pilih Murid</FieldLabel>
                                <Select onValueChange={(val) => form.setValue('user_id', val as LearningSubjectSchemaType['type'])}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder={'Pilih Murid'} />
                                    </SelectTrigger>
                                    <SelectContent aria-invalid={fieldState.invalid}>
                                        <SelectGroup>
                                            {studentList.map((student) => (
                                                <SelectItem key={student.id} value={student.id.toString()}>
                                                    {`${student.master_number} | ${student.name}`}
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
function Update({ handleCloseDialog, studyRoomId, user }: ActionProps) {
    const { studentList } = usePage().props as PageProps & { studentList: Array<User> };

    const [isLoading, setIsLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(studentInTheStudyRoomSchema),
        defaultValues: { user_id: user?.id || 0 },
    });

    function onSubmit(values: StudentInTheStudyRoomSchemaType) {
        const studenIds = studentList.map((student) => student.id);
        if (!studenIds.includes(values.user_id)) {
            return form.setError('user_id', { message: 'Mohon Pilih Tipe Pelajaran' });
        }
        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: (err: any) => {
                console.log(err);

                const errorMessage = err.server[0] || 'Terjadi kesalahan';
                form.setError('root', { message: errorMessage });

                toast.error(`Gagal mengganti siswa dari KBM ini`, {
                    description: errorMessage,
                    action: { label: 'OK', onClick: () => {} },
                });
            },
            onSuccess: () => {
                toast.success(`Berhasil mengganti siswa dari KBM ini`, {
                    action: { label: 'OK', onClick: () => {} },
                });
                form.reset();
                handleCloseDialog();
            },
        };
        router.patch(`/dashboard/admin/school/study-room/${studyRoomId}/change-student/${user?.id}`, values, requestOptions);
    }

    const isFormBusy = isLoading || form.formState.isLoading || form.formState.isSubmitting;
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Ganti Murid</DialogTitle>
                <DialogDescription>Ganti Murid di KBM ini</DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
                <FieldGroup>
                    <FieldError errors={[form.formState.errors.root]} />
                    <Controller
                        control={form.control}
                        name="user_id"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Pilih Murid</FieldLabel>
                                <Select
                                    defaultValue={Number(field.value).toString()}
                                    onValueChange={(val) => form.setValue('user_id', val as LearningSubjectSchemaType['type'])}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder={studentList.find((student) => student.id === field.value)?.name || 'Pilih Murid'} />
                                    </SelectTrigger>
                                    <SelectContent aria-invalid={fieldState.invalid}>
                                        <SelectGroup>
                                            {studentList.map((student) => (
                                                <SelectItem key={student.id} value={student.id.toString()}>
                                                    {`${student.master_number} | ${student.name}`}
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

function Delete({ studyRoomId, user, handleCloseDialog }: ActionProps) {
    const [isLoading, setIsLoading] = useState(false);

    function handleDelete() {
        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: (err: any) => {
                console.log(err);

                const errorMessage = err.server[0] || 'Terjadi kesalahan';

                toast.error(`Gagal Menghapus siswa dari KBM ini`, {
                    description: errorMessage,
                    action: { label: 'OK', onClick: () => {} },
                });
            },
            onSuccess: () => {
                toast.success(`Berhasil Menghapus siswa dari KBM ini`, {
                    action: { label: 'OK', onClick: () => {} },
                });
                handleCloseDialog();
            },
        };
        router.delete(`/dashboard/admin/school/study-room/${studyRoomId}/delete-student/${user?.id}`, requestOptions);
    }

    const isButtonBusy = isLoading;

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Hapus Pengguna dari KBM</DialogTitle>
                <DialogDescription>Aksi ini tidak menghapus data user, hanya menghapus keberadaan user dari KBM ini</DialogDescription>
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
