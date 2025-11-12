
import React, { useState } from 'react';

interface SplashScreenProps {
  onEnter: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
    const [isFadingOut, setIsFadingOut] = useState(false);

    const handleEnter = () => {
        setIsFadingOut(true);
        setTimeout(onEnter, 1000); // Match duration of fade-out animation
    };

    return (
        <div className={`fixed inset-0 flex items-center justify-center transition-opacity duration-1000 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
            <div className="text-center p-8 max-w-2xl mx-auto">
                <h1 className="font-magic text-5xl md:text-7xl text-amber-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.7)]">
                    Диван выбирает тебя
                </h1>
                <p className="font-body text-gray-200 mt-6 text-lg md:text-xl leading-relaxed">
                    Добро пожаловать в 'Диван-Таро' – уникальный салон в Минске, где не вы выбираете мебель, а она выбирает вас. Каждый диван в нашей коллекции обладает собственной историей и характером. Доверьтесь интуиции и позвольте магии выбора найти идеальное дополнение для вашего дома.
                </p>
                <button
                    onClick={handleEnter}
                    className="font-magic mt-10 px-8 py-3 text-xl bg-transparent border-2 border-amber-300 text-amber-300 rounded-lg hover:bg-amber-300 hover:text-gray-900 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                    Войти в Галерею
                </button>
            </div>
            {isFadingOut && <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, transparent 0%, #FFD700 100%)', animation: 'fadeOutAndShrink 1s forwards' }}></div>}
            <style>{`
                @keyframes fadeOutAndShrink {
                    0% { transform: scale(1); opacity: 0.5; }
                    100% { transform: scale(3); opacity: 0; }
                }
            `}</style>
        </div>
    );
};
