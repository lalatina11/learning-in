import { studyRoomSchema, StudyRoomSchemaType } from '@/lib/form-schema';
import { ClassRoomWithMajor, LearningSubject, StudyRoomWithClassRoomAndTeacher, User } from '@/types';
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
    studyRoom?: StudyRoomWithClassRoomAndTeacher;
}

interface ActionProps {
    handleCloseDialog: () => void;
    studyRoom?: StudyRoomWithClassRoomAndTeacher;
}

export default function StudyRoomForm({ children, type, studyRoom }: Props) {
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
                <Update handleCloseDialog={handleCloseDialog} studyRoom={studyRoom} />
            ) : (
                <Delete handleCloseDialog={handleCloseDialog} studyRoom={studyRoom} />
            )}
        </Dialog>
    );
}

function Create({ handleCloseDialog }: ActionProps) {
    const { teachers, classRooms, learningSubjects } = usePage().props as PageProps & {
        teachers: Array<User>;
        classRooms: Array<ClassRoomWithMajor>;
        learningSubjects: Array<LearningSubject>;
    };
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(studyRoomSchema),
        defaultValues: { classroom_id: 0, teacher_id: 0 },
    });

    function onSubmit(values: StudyRoomSchemaType) {
        if (classRooms.length < 1) {
            return form.setError('root', { message: 'Mohon buat Kelas terlebih dahulu' });
        }
        const classRoomIds = classRooms.map((classRoom) => classRoom.id);
        const teachersId = teachers.map((teacher) => teacher.id);
        if (!classRoomIds.includes(values.classroom_id) && !teachersId.includes(values.teacher_id)) {
            form.setError('classroom_id', { message: 'Mohon isi Kelas Dan Guru' });
            return form.setError('teacher_id', { message: 'Mohon isi Kelas Dan Guru' });
        }
        if (!classRoomIds.includes(values.classroom_id)) {
            return form.setError('classroom_id', { message: 'Mohon isi Kelas' });
        }
        if (!teachersId.includes(values.teacher_id)) {
            return form.setError('teacher_id', { message: 'Mohon isi Guru' });
        }

        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: (err: any) => {
                const errorMessage = err.server[0] || 'Terjadi kesalahan';
                form.setError('root', { message: errorMessage });

                toast.error(`Gagal Membuat KBM`, {
                    description: errorMessage,
                    action: { label: 'OK', onClick: () => {} },
                });
            },
            onSuccess: () => {
                toast.success(`Berhasil Membuat KBM`, {
                    action: { label: 'OK', onClick: () => {} },
                });
                form.reset();
                handleCloseDialog();
            },
        };
        router.post('/dashboard/admin/school/study-room', values, requestOptions);
    }

    const isFormBusy = isLoading || form.formState.isLoading || form.formState.isSubmitting;

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Tambahkan KBM</DialogTitle>
                <DialogDescription>Tambah KBM Baru</DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
                <FieldGroup>
                    <FieldError errors={[form.formState.errors.root]} />
                    <Controller
                        control={form.control}
                        name="classroom_id"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Pilih Kelas</FieldLabel>
                                <Select onValueChange={(val) => form.setValue('classroom_id', Number(val))}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Pilih Kelas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {classRooms.map((classRoom) => (
                                                <SelectItem key={classRoom.id} value={classRoom.id.toString()}>
                                                    {`${classRoom.grade} ${classRoom.major.name}`}
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
                        name="teacher_id"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Pilih Guru</FieldLabel>
                                <Select onValueChange={(val) => form.setValue('teacher_id', Number(val))}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Pilih Guru" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {teachers.map((teacher) => (
                                                <SelectItem key={teacher.id} value={teacher.id.toString()}>
                                                    {teacher.name}
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
                        name="learning_subject_id"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Pilih Mapel</FieldLabel>
                                <Select onValueChange={(val) => form.setValue('learning_subject_id', Number(val))}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder={'Pilih Mapel'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {learningSubjects.map((teacher) => (
                                                <SelectItem key={teacher.id} value={teacher.id.toString()}>
                                                    {teacher.name}
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
function Update({ handleCloseDialog, studyRoom }: ActionProps) {
    const { classRooms, teachers, learningSubjects } = usePage().props as PageProps & {
        classRooms: Array<ClassRoomWithMajor>;
        teachers: Array<User>;
        learningSubjects: Array<LearningSubject>;
    };
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(studyRoomSchema),
        defaultValues: {
            classroom_id: studyRoom?.classroom_id || 0,
            teacher_id: studyRoom?.teacher_id || 0,
            learning_subject_id: studyRoom?.learning_subject_id || 0,
        },
    });

    function onSubmit(values: StudyRoomSchemaType) {
        if (classRooms.length < 1) {
            return form.setError('root', { message: 'Mohon buat Kelas terlebih dahulu' });
        }
        const classRoomIds = classRooms.map((classRoom) => classRoom.id);
        const teachersId = teachers.map((teacher) => teacher.id);

        if (!classRoomIds.includes(values.classroom_id) && !teachersId.includes(values.teacher_id)) {
            form.setError('classroom_id', { message: 'Mohon isi Kelas Dan Guru' });
            return form.setError('teacher_id', { message: 'Mohon isi Kelas Dan Guru' });
        }

        if (!classRoomIds.includes(values.classroom_id)) {
            return form.setError('classroom_id', { message: 'Mohon isi Kelas' });
        }
        if (!teachersId.includes(values.teacher_id)) {
            return form.setError('teacher_id', { message: 'Mohon isi Guru' });
        }
        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: (err: any) => {
                console.log(err);

                const errorMessage = err.server[0] || 'Terjadi kesalahan';
                form.setError('root', { message: errorMessage });

                toast.error(`Gagal Mengubah KBM ini`, {
                    description: errorMessage,
                    action: { label: 'OK', onClick: () => {} },
                });
            },
            onSuccess: () => {
                toast.success(`Berhasil Mengubah KBM ini`, {
                    action: { label: 'OK', onClick: () => {} },
                });
                form.reset();
                handleCloseDialog();
            },
        };
        router.patch(`/dashboard/admin/school/study-room/${studyRoom?.id}`, values, requestOptions);
    }

    const isFormBusy = isLoading || form.formState.isLoading || form.formState.isSubmitting;
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Update KBM</DialogTitle>
                <DialogDescription>Edit KBM </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
                <FieldGroup>
                    <FieldError errors={[form.formState.errors.root]} />
                    <Controller
                        control={form.control}
                        name="classroom_id"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Pilih Kelas</FieldLabel>
                                <Select
                                    defaultValue={Number(field.value).toString()}
                                    onValueChange={(val) => form.setValue('classroom_id', Number(val))}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue
                                            placeholder={
                                                `${classRooms.find((classRoom) => classRoom.id === field.value)?.grade} ${classRooms.find((classRoom) => classRoom.id === field.value)?.major.name}` ||
                                                'Pilih Kelas'
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {classRooms.map((classRoom) => (
                                                <SelectItem key={classRoom.id} value={classRoom.id.toString()}>
                                                    {`${classRoom.grade} ${classRoom.major.name}`}
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
                        name="teacher_id"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Pilih Guru</FieldLabel>
                                <Select
                                    defaultValue={Number(field.value).toString()}
                                    onValueChange={(val) => form.setValue('teacher_id', Number(val))}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder={teachers.find((teacher) => teacher.id === field.value)?.name || 'Pilih Guru'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {teachers.map((teacher) => (
                                                <SelectItem key={teacher.id} value={teacher.id.toString()}>
                                                    {teacher.name}
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
                        name="learning_subject_id"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Pilih Mapel</FieldLabel>
                                <Select
                                    defaultValue={Number(field.value).toString()}
                                    onValueChange={(val) => form.setValue('learning_subject_id', Number(val))}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue
                                            placeholder={learningSubjects.find((subject) => subject.id === field.value)?.name || 'Pilih Mapel'}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {learningSubjects.map((teacher) => (
                                                <SelectItem key={teacher.id} value={teacher.id.toString()}>
                                                    {teacher.name}
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

function Delete({ studyRoom, handleCloseDialog }: ActionProps) {
    const [isLoading, setIsLoading] = useState(false);

    function handleDelete() {
        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: (err: any) => {
                console.log(err);

                const errorMessage = err.server[0] || 'Terjadi kesalahan';

                toast.error(`Gagal Menghapus KBM ini`, {
                    description: errorMessage,
                    action: { label: 'OK', onClick: () => {} },
                });
            },
            onSuccess: () => {
                toast.success(`Berhasil Menghapus KBM ini`, {
                    action: { label: 'OK', onClick: () => {} },
                });
                handleCloseDialog();
            },
        };
        router.delete(`/dashboard/admin/school/study-room/${studyRoom?.id}`, requestOptions);
    }

    const isButtonBusy = isLoading;

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Hapus KBM</DialogTitle>
                <DialogDescription>Apakah anda yakin menghapus KBM ini? Tindakan ini tidak bisa dipulihkan</DialogDescription>
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
