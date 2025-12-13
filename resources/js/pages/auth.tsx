import AuthPageContainer from '@/components/containers/auth-page-container';
import LoginForm from '@/components/forms/login-form';
import { ModeToggle } from '@/components/ThemeToggler';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Head } from '@inertiajs/react';

const AuthPage = () => {
    return (
        <AuthPageContainer>
            <Head title={`Learning-IN Login`}></Head>
            <main className="flex min-h-screen w-screen flex-col justify-between">
                <section className="m-auto w-full max-w-5xl p-4 md:mx-auto md:my-0 md:mt-20 md:p-0">
                    <Card className="grid h-auto grid-cols-1 p-0 md:grid-cols-2 md:p-3">
                        <CardContent className="hidden flex-col items-center justify-center gap-3 md:flex">
                            <img src="/EL.svg" className="mx-auto hidden size-64 rounded-lg object-cover dark:block" />
                            <img src="/EL-invert.svg" className="mx-auto block size-64 rounded-lg object-cover dark:hidden" />
                            <span className="text-xs text-muted-foreground">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus perspiciatis
                            </span>
                        </CardContent>
                        <CardContent className="p-0 md:p-3">
                            <Card className="">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div className="flex flex-col gap-2">
                                        <CardTitle>Login</CardTitle>
                                        <CardDescription>Login menggunakan nim dan password anda</CardDescription>
                                    </div>
                                    <ModeToggle />
                                </CardHeader>
                                <CardContent>
                                    <LoginForm />
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>
                </section>
            </main>
        </AuthPageContainer>
    );
};

export default AuthPage;
