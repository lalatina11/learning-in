import HomePageContainer from '@/components/containers/home-page-container';
import Faq from '@/components/FAQ';
import GroupMembers, { SLIDES } from '@/components/group-members';
import { ModeToggle } from '@/components/ThemeToggler';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageProps } from '@/types/page-props';
import { Head, Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, LogIn } from 'lucide-react';
import { motion } from 'motion/react';

const Welcome = () => {
    const {
        auth: { user },
    } = usePage().props as PageProps;
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
                        {user ? (
                            <Link href={`/dashboard/${user.role === 'ADMIN' ? 'admin' : user.role === 'TEACHER' ? 'teacher' : ''}`}>
                                <LayoutDashboard /> Dashboard
                            </Link>
                        ) : (
                            <Link href={'/login'}>
                                <LogIn />
                                Login
                            </Link>
                        )}
                    </Button>
                    <div className="ml-3">
                        <ModeToggle />
                    </div>
                </nav>
            </header>
            <motion.main
                initial={{ opacity: 0, y: 500 }}
                whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
                className="container mx-auto flex flex-col gap-3"
            >
                <section className="flex h-72 flex-col items-center justify-center gap-2">
                    <span className="text-lg font-semibold underline underline-offset-8">Selamat Datang di Learning IN,</span>
                    <span className="text-sm font-semibold text-muted-foreground">Platform e-learning buatan dari Kelompok 2 Web Programming 2</span>
                    <motion.span
                        initial={{ opacity: 0, scaleY: 0.5 }}
                        animate={{ opacity: 1, scaleY: 1, transition: { delay: 0.5, duration: 1.2 } }}
                        className="text-xs text-muted-foreground"
                    >
                        Lorem ipsum dolor, sit amet consectetur adipisicing espant. Saepe consequatur corporis doloribus quos, molestiae aspanquid
                        quis sunt. Amet repellat vero molestiae vespant iure incidunt, quisquam sapiente dicta repellendus sed? Quibusdam. Temporibus
                        minus, nihil totam nobis in earum deserunt aperiam suscipit sequi, voluptates cum magni. Qui tempora, adipisci vero dolorum
                        debitis ea, obcaecati neque laboriosam numquam, repellendus atque! Ipsa, officia espangendi! Totam porro error illum autem,
                        quidem a omnis doloribus ea accusantium, rem magni? Magni natus quasi repudiandae ratione voluptas neque harum at cupiditate,
                        perspiciatis quos, sint voluptatem maxime voluptatibus nobis.
                    </motion.span>
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
                <motion.section
                    className="mx-auto mt-10"
                    initial={{ opacity: 0.5, x: 1000 }}
                    whileInView={{ opacity: 1, x: 0, transition: { duration: 0.8 } }}
                >
                    <Card className="w-3xl">
                        <CardContent>
                            <GroupMembers />
                        </CardContent>
                    </Card>
                </motion.section>
                <motion.section
                    initial={{ opacity: 0.5, x: -1000 }}
                    whileInView={{ opacity: 1, x: 0, transition: { duration: 0.8 } }}
                    className="mx-auto mt-10 flex flex-col gap-3"
                >
                    <Faq />
                </motion.section>
            </motion.main>
        </HomePageContainer>
    );
};

export default Welcome;
