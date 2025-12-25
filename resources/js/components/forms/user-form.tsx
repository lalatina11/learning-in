import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { registerSchema, RegisterSchemaType } from '@/lib/form-schema';
import { switchUserRoleToCapitalize } from '@/lib/switch-cases';
import { User } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '../ui/input-group';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Spinner } from '../ui/spinner';

const roleOptions = ['ADMIN', 'STUDENT', 'TEACHER'] as const as Array<RegisterSchemaType['role']>;

interface Props {
    user?: User;
    children: ReactNode;
    type: 'create' | 'update' | 'delete';
}

interface ActionProps {
    user?: User;
    handleCloseSheet: () => void;
}

export default function CreateOrUpdateUserForm({ user, children, type }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    const handleCloseSheet = () => {
        setIsOpen(false);
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            {type === 'create' ? (
                <Create handleCloseSheet={handleCloseSheet} />
            ) : type === 'update' ? (
                <Update handleCloseSheet={handleCloseSheet} user={user} />
            ) : (
                <Delete handleCloseSheet={handleCloseSheet} user={user} />
            )}
        </Sheet>
    );
}

function Create({ handleCloseSheet }: ActionProps) {
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            master_number: '',
            email: '',
            name: '',
            password: '',
            role: 'STUDENT' as RegisterSchemaType['role'],
        },
    });

    const onSubmit = async (body: RegisterSchemaType) => {
        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: (err: any) => {
                const errorMessage = err.server[0] || 'Terjadi kesalahan';
                form.setError('root', { message: errorMessage });

                toast.error(`Gagal Menambahkan Pengguna`, {
                    description: errorMessage,
                    action: { label: 'OK', onClick: () => {} },
                });
            },
            onSuccess: () => {
                toast.success(`Berhasil Menambahkan Pengguna`, {
                    action: { label: 'OK', onClick: () => {} },
                });
                handleCloseSheet();
                form.reset();
            },
        };

        // Execute request
        router.post('/dashboard/admin/user', body, requestOptions);
    };

    return (
        <SheetContent>
            <SheetHeader>
                <SheetTitle>Tambahkan Pengguna</SheetTitle>
                <SheetDescription>Mohon Masukkan data yang sesuai</SheetDescription>
            </SheetHeader>
            <ScrollArea className="overflow-y-auto p-5">
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 p-1">
                    <div className="flex flex-col gap-3">
                        {form.formState.errors.root && <FieldError errors={[form.formState.errors.root]} />}
                        <Controller
                            control={form.control}
                            name="master_number"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={!!fieldState.error}>
                                    <FieldLabel htmlFor={field.name}>NIM</FieldLabel>
                                    <Input {...field} id={field.name} autoComplete="off" aria-invalid={fieldState.invalid} placeholder="1924****" />
                                    <FieldDescription>Masukkan NIM/NIK Pengguna</FieldDescription>
                                    <FieldError errors={[fieldState.error]} />
                                </Field>
                            )}
                        />
                        <Controller
                            control={form.control}
                            name="name"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={!!fieldState.error}>
                                    <FieldLabel htmlFor={field.name}>Nama</FieldLabel>
                                    <Input {...field} id={field.name} autoComplete="off" aria-invalid={fieldState.invalid} placeholder="John Doe" />
                                    <FieldDescription>Masukkan Nama Pengguna</FieldDescription>
                                    <FieldError errors={[fieldState.error]} />
                                </Field>
                            )}
                        />
                        <Controller
                            control={form.control}
                            name="email"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={!!fieldState.error}>
                                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        autoComplete="off"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="john@doe.com"
                                    />
                                    <FieldDescription>Masukkan Email Pengguna</FieldDescription>
                                    <FieldError errors={[fieldState.error]} />
                                </Field>
                            )}
                        />
                        <Controller
                            control={form.control}
                            name="password"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={!!fieldState.error}>
                                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            id={field.name}
                                            autoComplete="off"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="******"
                                            type={isShowPassword ? 'text' : 'password'}
                                        />
                                        <InputGroupAddon align={'inline-end'}>
                                            <InputGroupButton onClick={() => setIsShowPassword((prev) => !prev)} type="button">
                                                {isShowPassword ? <EyeOff /> : <Eye />}
                                            </InputGroupButton>
                                        </InputGroupAddon>
                                    </InputGroup>
                                    <FieldDescription>Password Optional</FieldDescription>
                                    <FieldError errors={[fieldState.error]} />
                                </Field>
                            )}
                        />
                        <Controller
                            control={form.control}
                            name="role"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={!!fieldState.error}>
                                    <FieldLabel htmlFor={field.name}>Daftarkan sebagai</FieldLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger id={field.name}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roleOptions.map((option) => (
                                                <SelectItem key={option} value={option}>
                                                    Sebagai {switchUserRoleToCapitalize(option)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FieldError errors={[fieldState.error]} />
                                </Field>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Button type="button" onClick={handleCloseSheet} variant="outline">
                            Batal
                        </Button>
                        <Button disabled={isLoading} type="submit">
                            {isLoading ? <Spinner /> : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </ScrollArea>
        </SheetContent>
    );
}

function Update({ user, handleCloseSheet }: ActionProps) {
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            master_number: user !== undefined ? user.master_number : '',
            email: user !== undefined ? user.email : '',
            name: user !== undefined ? user.name : '',
            password: '',
            role: user !== undefined ? user.role : ('STUDENT' as RegisterSchemaType['role']),
        },
    });

    const onSubmit = async (body: RegisterSchemaType) => {
        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: (err: any) => {
                const errorMessage = err.server[0] || 'Terjadi kesalahan';
                form.setError('root', { message: errorMessage });

                toast.error(`Gagal Menghapus Pengguna`, {
                    description: errorMessage,
                    action: { label: 'OK', onClick: () => {} },
                });
            },
            onSuccess: () => {
                toast.success(`Berhasil Menghapus Pengguna`, {
                    action: { label: 'OK', onClick: () => {} },
                });
                handleCloseSheet();
            },
        };

        // Execute request
        router.patch(`/dashboard/admin/user/${user?.id}`, body, requestOptions);
    };
    return (
        <SheetContent>
            <SheetHeader>
                <SheetTitle>Tambahkan Pengguna</SheetTitle>
                <SheetDescription>Mohon Masukkan data yang sesuai</SheetDescription>
            </SheetHeader>
            <ScrollArea className="overflow-y-auto p-5">
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 p-1">
                    <div className="flex flex-col gap-3">
                        {form.formState.errors.root && <FieldError errors={[form.formState.errors.root]} />}
                        <Controller
                            control={form.control}
                            name="master_number"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={!!fieldState.error}>
                                    <FieldLabel htmlFor={field.name}>NIM</FieldLabel>
                                    <Input {...field} id={field.name} autoComplete="off" aria-invalid={fieldState.invalid} placeholder="1924****" />
                                    <FieldDescription>Masukkan NIM/NIK Pengguna</FieldDescription>
                                    <FieldError errors={[fieldState.error]} />
                                </Field>
                            )}
                        />
                        <Controller
                            control={form.control}
                            name="name"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={!!fieldState.error}>
                                    <FieldLabel htmlFor={field.name}>Nama</FieldLabel>
                                    <Input {...field} id={field.name} autoComplete="off" aria-invalid={fieldState.invalid} placeholder="John Doe" />
                                    <FieldDescription>Masukkan Nama Pengguna</FieldDescription>
                                    <FieldError errors={[fieldState.error]} />
                                </Field>
                            )}
                        />
                        <Controller
                            control={form.control}
                            name="email"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={!!fieldState.error}>
                                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        autoComplete="off"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="john@doe.com"
                                    />
                                    <FieldDescription>Masukkan Email Pengguna</FieldDescription>
                                    <FieldError errors={[fieldState.error]} />
                                </Field>
                            )}
                        />
                        <Controller
                            control={form.control}
                            name="password"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={!!fieldState.error}>
                                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            id={field.name}
                                            autoComplete="off"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="******"
                                            type={isShowPassword ? 'text' : 'password'}
                                        />
                                        <InputGroupAddon align={'inline-end'}>
                                            <InputGroupButton onClick={() => setIsShowPassword((prev) => !prev)} type="button">
                                                {isShowPassword ? <EyeOff /> : <Eye />}
                                            </InputGroupButton>
                                        </InputGroupAddon>
                                    </InputGroup>
                                    <FieldDescription>Password Optional</FieldDescription>
                                    <FieldError errors={[fieldState.error]} />
                                </Field>
                            )}
                        />
                        <Controller
                            control={form.control}
                            name="role"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={!!fieldState.error}>
                                    <FieldLabel htmlFor={field.name}>Daftarkan sebagai</FieldLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger id={field.name}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roleOptions.map((option) => (
                                                <SelectItem key={option} value={option}>
                                                    Sebagai {switchUserRoleToCapitalize(option)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FieldError errors={[fieldState.error]} />
                                </Field>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Button type="button" onClick={handleCloseSheet} variant="outline">
                            Batal
                        </Button>
                        <Button disabled={isLoading} type="submit">
                            {isLoading ? <Spinner /> : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </ScrollArea>
        </SheetContent>
    );
}

function Delete({ handleCloseSheet, user }: ActionProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = () => {
        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: (err: any) => {
                const errorMessage = err.server[0] || 'Terjadi kesalahan';
                toast.error(`Gagal Mengedit Pengguna`, {
                    description: errorMessage,
                    action: { label: 'OK', onClick: () => {} },
                });
            },
            onSuccess: () => {
                toast.success(`Berhasil Mengedit Pengguna`, {
                    action: { label: 'OK', onClick: () => {} },
                });
                handleCloseSheet();
            },
        };

        // Execute request
        router.delete(`/dashboard/admin/user/${user?.id}`, requestOptions);
    };

    return (
        <SheetContent>
            <SheetHeader>
                <SheetTitle>Hapus Pengguna</SheetTitle>
                <SheetDescription>Apakah anda yakin akan menghapus pengguna ini? Tindakan ini tidak bisa dipulihkan</SheetDescription>
            </SheetHeader>
            <ScrollArea className="overflow-y-auto">
                <div className="grid grid-cols-2 gap-2 px-5">
                    <Button type="button" onClick={handleCloseSheet} variant="outline">
                        Batal
                    </Button>
                    <Button variant={'destructive'} disabled={isLoading} onClick={handleDelete}>
                        {isLoading ? <Spinner /> : 'Hapus'}
                    </Button>
                </div>
            </ScrollArea>
        </SheetContent>
    );
}
