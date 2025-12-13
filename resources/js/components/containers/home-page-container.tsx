import { ReactNode } from 'react';
import { GravityStarsBackground } from '../animate-ui/components/backgrounds/gravity-stars';
import Footer from '../footer';
import ToasterProviderContainer from './toaster-provider-container';

interface Props {
    children: ReactNode;
}

const HomePageContainer = ({ children }: Props) => {
    return (
        <ToasterProviderContainer>
            <GravityStarsBackground className="absolute inset-0 -z-10 flex items-center justify-center" />
            <div className="m-0">
                {children}
                <Footer />
            </div>
        </ToasterProviderContainer>
    );
};

export default HomePageContainer;
