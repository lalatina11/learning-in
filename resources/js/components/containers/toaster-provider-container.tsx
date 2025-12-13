import { ReactNode } from 'react';
import ToasterProvider from '../providers/toaster-provider';

interface Props {
    children: ReactNode;
}
const ToasterProviderContainer = ({ children }: Props) => {
    return (
        <>
            {children}
            <ToasterProvider />
        </>
    );
};

export default ToasterProviderContainer;
