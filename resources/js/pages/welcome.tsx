import HomePageContainer from '@/components/containers/home-page-container';
import Faq from '@/components/FAQ';
import GroupMembers, { SLIDES } from '@/components/group-members';
import { ModeToggle } from '@/components/ThemeToggler';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';

const Welcome = () => {
    return (
        <HomePageContainer>
            <Head title="Welcome"></Head>
            <header className="flex items-center justify-between border-b border-zinc-500 p-4">
                <Link href={'/'} className="flex items-center gap-1">
                    <img src="/EL.svg" className="hidden h-auto w-10 rounded-md object-cover dark:block" />
                    <img src="/EL-invert.svg" className="block h-auto w-10 rounded-md object-cover dark:hidden" />
                    <span className="text-xl font-semibold">Learning IN</span>
                </Link>
                <nav className="flex items-center gap-2 font-semibold">
                    <Button asChild>
                        <Link href={'/login'}>Login</Link>
                    </Button>
                    <div className="ml-3">
                        <ModeToggle />
                    </div>
                </nav>
            </header>
            <main className="container mx-auto flex flex-col gap-3">
                <section className="flex h-72 flex-col items-center justify-center gap-2">
                    <span className="text-lg font-semibold underline underline-offset-8">Selamat Datang di Learning IN,</span>
                    <span className="text-sm font-semibold text-muted-foreground">Platform e-learning buatan dari Kelompok 2 Web Programming 2</span>
                    <span className="text-xs text-muted-foreground">
                        Lorem ipsum dolor, sit amet consectetur adipisicing espant. Saepe consequatur corporis doloribus quos, molestiae aspanquid
                        quis sunt. Amet repellat vero molestiae vespant iure incidunt, quisquam sapiente dicta repellendus sed? Quibusdam. Temporibus
                        minus, nihil totam nobis in earum deserunt aperiam suscipit sequi, voluptates cum magni. Qui tempora, adipisci vero dolorum
                        debitis ea, obcaecati neque laboriosam numquam, repellendus atque! Ipsa, officia espangendi! Totam porro error illum autem,
                        quidem a omnis doloribus ea accusantium, rem magni? Magni natus quasi repudiandae ratione voluptas neque harum at cupiditate,
                        perspiciatis quos, sint voluptatem maxime voluptatibus nobis.
                    </span>
                </section>
                <section className="mx-auto">
                    <Card className="w-md">
                        <CardHeader>
                            <CardTitle>Anggota Kelompok:</CardTitle>
                            <CardDescription>Anggota Kelompok 2 Web Programming II</CardDescription>
                        </CardHeader>
                        <CardContent className="gap- flex-col2 flex flex-col gap-2 text-sm">
                            {SLIDES.map((member, idx) => (
                                <span key={idx}>
                                    {idx + 1}. {member.name} - {member.nim}
                                </span>
                            ))}
                        </CardContent>
                    </Card>
                </section>
                <section className="mx-auto mt-10">
                    <Card className="w-3xl">
                        <CardContent>
                            <GroupMembers />
                        </CardContent>
                    </Card>
                </section>
                <section className="mx-auto mt-10 flex flex-col gap-3">
                    <Faq />
                </section>
            </main>
        </HomePageContainer>
    );
};

export default Welcome;
