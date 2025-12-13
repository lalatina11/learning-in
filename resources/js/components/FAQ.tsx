import { Accordion, AccordionButton, AccordionItem, AccordionPanel } from './animate-ui/components/headless/accordion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface FaqType {
    question: string;
    answer: string;
}

const exampleFaq = [
    {
        question: 'Apa itu platform Learning-IN?',
        answer: 'Platform Learning-IN kami adalah sistem pembelajaran online yang memungkinkan Anda mengakses berbagai kursus dan materi pembelajaran kapan saja dan di mana saja melalui internet.',
    },
    {
        question: 'Bagaimana cara mendaftar akun?',
        answer: "Klik tombol 'Daftar' di halaman utama, isi formulir dengan email dan password Anda, lalu verifikasi email yang dikirimkan ke inbox Anda untuk mengaktifkan akun.",
    },
    {
        question: 'Apakah saya bisa mengakses kursus secara gratis?',
        answer: 'Ya, kami menyediakan beberapa kursus gratis. Namun untuk kursus premium dengan fitur lengkap dan sertifikat, Anda perlu melakukan pembelian atau berlangganan.',
    },
    {
        question: 'Bagaimana cara membeli kursus?',
        answer: "Pilih kursus yang Anda inginkan, klik tombol 'Beli Sekarang', pilih metode pembayaran yang tersedia, dan selesaikan proses pembayaran. Kursus akan langsung tersedia di dashboard Anda.",
    },
    {
        question: 'Apakah saya mendapatkan sertifikat setelah menyelesaikan kursus?',
        answer: 'Ya, Anda akan mendapatkan sertifikat digital setelah menyelesaikan seluruh materi kursus dan lulus ujian akhir dengan nilai minimal yang ditentukan.',
    },
    {
        question: 'Berapa lama akses kursus yang saya beli?',
        answer: 'Akses kursus bersifat seumur hidup (lifetime access). Anda dapat mengakses materi kursus kapan saja tanpa batas waktu setelah pembelian.',
    },
    {
        question: 'Apakah ada batas waktu untuk menyelesaikan kursus?',
        answer: 'Tidak ada batas waktu. Anda dapat belajar dengan kecepatan Anda sendiri dan menyelesaikan kursus sesuai jadwal yang Anda tentukan.',
    },
    {
        question: 'Bagaimana jika saya mengalami kendala teknis?',
        answer: 'Anda dapat menghubungi tim support kami melalui email support@elearning.com atau fitur live chat yang tersedia di platform. Tim kami siap membantu Anda 24/7.',
    },
    {
        question: 'Apakah materi kursus bisa diunduh?',
        answer: 'Beberapa materi seperti PDF dan dokumen pendukung dapat diunduh. Namun video pembelajaran hanya dapat ditonton secara streaming untuk melindungi hak cipta.',
    },
    {
        question: 'Bagaimana cara meminta refund?',
        answer: 'Anda dapat meminta refund dalam 30 hari pertama setelah pembelian jika tidak puas dengan kursus. Hubungi tim support dengan menyertakan alasan dan bukti pembelian untuk proses refund.',
    },
] as Array<FaqType>;

const Faq = () => {
    return (
        <Card className="w-3xl">
            <CardHeader>
                <CardTitle className="underline underline-offset-8">Pertanyaan yang biasa ditanyakan pengguna</CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion>
                    {exampleFaq.map((faq) => (
                        <AccordionItem key={faq.question}>
                            <AccordionButton>{faq.question}</AccordionButton>
                            <AccordionPanel>
                                <div className="text-sm text-muted-foreground">{faq.answer}</div>
                            </AccordionPanel>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
};

export default Faq;
