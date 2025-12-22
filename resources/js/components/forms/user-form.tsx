import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { registerSchema, RegisterSchemaType } from '@/lib/form-schema';
import { switchUserRoleToCapitalize } from '@/lib/switch-cases';
import { User } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { Edit, Eye, EyeOff, Plus } from 'lucide-react';
import { useState } from 'react';
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
}

export default function CreateOrUpdateUserForm({ user }: Props) {
    const [mode] = useState<'update' | 'create'>(user !== undefined ? 'update' : 'create');
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isShowPassword, setIsShowPassword] = useState(false);

    const isCreateForm = mode === 'create';

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

    const handleCloseSheet = () => {
        setIsOpen(false);
    };

    const onSubmit = async (body: RegisterSchemaType) => {
        // Early validation for create form
        if (isCreateForm && body.password.trim().length < 8) {
            form.setError('password', { message: 'Minimal 8 karakter' });
            toast.error('Gagal Membuat Pengguna baru', {
                description: 'Password tidak valid',
                action: { label: 'OK', onClick: () => {} },
            });
            return;
        }

        // Determine route and method
        const isUpdate = user !== undefined && !isCreateForm;
        const endpoint = isUpdate ? `/dashboard/admin/user/${user.id}` : '/dashboard/admin/user';
        const method = isUpdate ? 'patch' : 'post';

        // Common request options
        const requestOptions = {
            onStart: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: (err: any) => {
                const errorMessage = err.server[0] || 'Terjadi kesalahan';
                form.setError('root', { message: errorMessage });

                toast.error(`Gagal ${isCreateForm ? 'Membuat' : 'Mengedit'} Pengguna${isCreateForm ? ' Baru' : ''}`, {
                    description: errorMessage,
                    action: { label: 'OK', onClick: () => {} },
                });
            },
            onSuccess: () => {
                toast.success(`Berhasil ${isCreateForm ? 'Membuat' : 'Mengedit'} Pengguna${isCreateForm ? ' Baru' : ''}`, {
                    action: { label: 'OK', onClick: () => {} },
                });
                if (isCreateForm) {
                    form.reset();
                }
                handleCloseSheet();
            },
        };

        // Execute request
        router[method](endpoint, body, requestOptions);
    };
    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button onClick={() => setIsOpen(true)}>
                    {isCreateForm ? (
                        <>
                            <Plus /> Daftarkan Pengguna baru
                        </>
                    ) : (
                        <>
                            <Edit />
                            <span className="hidden md:block">Edit</span>
                        </>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{user !== undefined ? `Edit ${user?.name}` : 'Tambahkan Pengguna'}</SheetTitle>
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
                                        <Input
                                            {...field}
                                            id={field.name}
                                            autoComplete="off"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="1924****"
                                        />
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
                                        <Input
                                            {...field}
                                            id={field.name}
                                            autoComplete="off"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="John Doe"
                                        />
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
                                        <FieldDescription>{isCreateForm ? 'Masukkan Password Pengguna' : 'Password optional'}</FieldDescription>
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
                            <Button type="button" onClick={handleCloseSheet} variant="destructive">
                                Batal
                            </Button>
                            <Button disabled={isLoading} type="submit">
                                {isLoading ? <Spinner /> : 'Simpan'}
                            </Button>
                        </div>
                    </form>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
