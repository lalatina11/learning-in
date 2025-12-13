import { ReactNode } from 'react';
import Footer from '../footer';
import ToasterProvider from '../providers/toaster-provider';
import ToasterProviderContainer from './toaster-provider-container';

interface Props {
    children: ReactNode;
}

const AuthPageContainer = ({ children }: Props) => {
    return (
        <ToasterProviderContainer>
            <div className="w-screen overflow-x-hidden">
                {children}
                <Footer />
            </div>
            <ToasterProvider />
        </ToasterProviderContainer>
    );
};

export default AuthPageContainer;
