import { loginSchema, LoginSchemaType } from '@/lib/form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { Eye, EyeClosed } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { RippleButton, RippleButtonRipples } from '../animate-ui/components/buttons/ripple';
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '../ui/input-group';
import { Spinner } from '../ui/spinner';

const LoginForm = () => {
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            master_number: '',
            password: '',
        },
    });

    const handleSubmit = async (body: LoginSchemaType) => {
        const actionOptions = {
            onStart: () => {
                setIsLoading(true);
            },
            onFinish: () => {
                setIsLoading(false);
            },
            onError: (errors: any) => {
                const errorMessage = errors.server?.[0] || 'Terjadi Kesalahan';
                form.setError('root', { message: errorMessage });
                toast.error('Gagal login', {
                    description: errorMessage,
                    action: {
                        label: 'OK',
                        onClick: () => {},
                    },
                });
            },
            onSuccess: () => {
                toast.success('Berhasil Login', {
                    description: 'Anda sedang diarahkan menuju halaman dashboard!',
                    action: {
                        label: 'OK',
                        onClick: () => {},
                    },
                });
            },
        };
        router.post('login', body, actionOptions);
    };

    return (
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
            {form.formState.errors.root && <FieldError className="w-full text-center text-xs" errors={[form.formState.errors.root]} />}
            <Controller
                name="master_number"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>NIM</FieldLabel>
                        <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="1924****" autoComplete="off" />
                        <FieldDescription className="text-xs">Isikan NIM yang sesuai</FieldDescription>
                        {fieldState.invalid && <FieldError className="text-xs" errors={[fieldState.error]} />}
                    </Field>
                )}
            />
            <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                        <InputGroup>
                            <InputGroupInput
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                placeholder="********"
                                autoComplete="off"
                                type={isShowPassword ? 'text' : 'password'}
                            />
                            <InputGroupAddon align={'inline-end'}>
                                <InputGroupButton type="button" onClick={() => setIsShowPassword((prev) => !prev)}>
                                    {isShowPassword ? <EyeClosed /> : <Eye />}
                                </InputGroupButton>
                            </InputGroupAddon>
                        </InputGroup>
                        <FieldDescription className="text-xs">Isikan password yang sesuai</FieldDescription>
                        {fieldState.invalid && <FieldError className="text-xs" errors={[fieldState.error]} />}
                    </Field>
                )}
            />
            <RippleButton disabled={isLoading}>
                {isLoading ? <Spinner /> : 'Login'}
                <RippleButtonRipples />
            </RippleButton>
        </form>
    );
};

export default LoginForm;
