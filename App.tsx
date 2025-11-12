
import React, { useState } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { Gallery } from './components/Gallery';

const App: React.FC = () => {
    const [page, setPage] = useState<'splash' | 'gallery'>('splash');

    const handleEnterGallery = () => {
        setPage('gallery');
    };

    return (
        <div className="min-h-screen w-full overflow-hidden">
            {page === 'splash' && <SplashScreen onEnter={handleEnterGallery} />}
            {page === 'gallery' && <Gallery />}
        </div>
    );
};

export default App;
