import { router } from '@inertiajs/react';
import { LogOut } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';

interface Props {
    isButtonTextHidden?: boolean;
}

const LogOutForm = ({ isButtonTextHidden }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const handleLogout = () => {
        router.delete('/logout', {
            onStart: () => {
                setIsLoading(true);
            },
            onSuccess: () => {
                setIsLoading(false);
            },
        });
        toast.success('Berhasil Logout', {
            description: 'Anda akan diarahkan ke halaman login',
            action: {
                label: 'OK',
                onClick: () => {},
            },
        });
    };

    return (
        <Button disabled={isLoading} className="w-full" onClick={handleLogout} variant={'destructive'}>
            {isLoading ? (
                <Spinner />
            ) : (
                <>
                    <LogOut />
                    {!isButtonTextHidden && <span className="hidden md:block">Logout</span>}
                </>
            )}
        </Button>
    );
};

export default LogOutForm;
