import { ReactNode } from 'react';
import tarotHero from '../assets/tarot-hero.jpg';

interface BackgroundWrapperProps {
  children: ReactNode;
}

const BackgroundWrapper = ({ children }: BackgroundWrapperProps) => {
  return (
    <div 
      className="min-h-screen bg-mystical-overlay"
      style={{
        backgroundImage: `url(${tarotHero})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {children}
    </div>
  );
};

export default BackgroundWrapper; 