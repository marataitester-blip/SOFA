
import React, { useState, useEffect, useRef } from 'react';
import { Sofa } from '../types';
import { sofaData } from '../data/sofaData';
import { useAudio } from '../hooks/useAudio';
import { SpeakerOnIcon, SpeakerOffIcon, VoiceIcon } from './icons';

export const Gallery: React.FC = () => {
    const [currentSofaId, setCurrentSofaId] = useState(1);
    const [isChoosing, setIsChoosing] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [contentKey, setContentKey] = useState(0); // Used to re-trigger animations
    
    const { playClickSound, playShuffleSound, playTriumphSound, speak, stopSpeaking } = useAudio(isMuted);
    
    const intervalRef = useRef<number | null>(null);

    const currentSofa = sofaData.find(s => s.id === currentSofaId) || sofaData[0];

    const handleSofaSelect = (id: number) => {
        if (isChoosing) return;
        playClickSound();
        stopSpeaking();
        setCurrentSofaId(id);
        setContentKey(prev => prev + 1); // Trigger fade-in animation
    };

    const handleRandomSelect = () => {
        if (isChoosing) return;

        setIsChoosing(true);
        playShuffleSound();
        stopSpeaking();

        intervalRef.current = window.setInterval(() => {
            const randomId = Math.floor(Math.random() * sofaData.length) + 1;
            setCurrentSofaId(randomId);
        }, 100);

        setTimeout(() => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            const finalId = Math.floor(Math.random() * sofaData.length) + 1;
            setCurrentSofaId(finalId);
            setContentKey(prev => prev + 1);
            setIsChoosing(false);
            playTriumphSound();
        }, 3000);
    };

    const handleContact = () => {
        playClickSound();
        window.open('https://t.me/divanby', '_blank');
    };
    
    const toggleMute = () => {
        playClickSound();
        setIsMuted(!isMuted);
    };

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            stopSpeaking();
        };
    }, [stopSpeaking]);

    return (
        <div className="min-h-screen w-full font-body flex flex-col p-4 md:p-6 lg:p-8 animate-fadeIn">
            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              .animate-fadeIn { animation: fadeIn 1s ease-in-out; }

              @keyframes contentFadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .animate-contentFadeIn { animation: contentFadeIn 0.5s ease-in-out; }
            `}</style>
            
            <header className="flex justify-between items-center mb-4 flex-shrink-0">
                <h1 className="font-magic text-3xl md:text-4xl text-amber-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">Диван-Таро</h1>
                <button onClick={toggleMute} className="p-2 text-gray-300 hover:text-white transition-colors">
                    {isMuted ? <SpeakerOffIcon className="h-6 w-6" /> : <SpeakerOnIcon className="h-6 w-6" />}
                </button>
            </header>

            <main key={contentKey} className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 animate-contentFadeIn">
                <div className="bg-black/30 backdrop-blur-sm rounded-lg shadow-2xl flex items-center justify-center p-4">
                    <img 
                        src={currentSofa.image} 
                        alt={currentSofa.name} 
                        className="max-h-[70vh] w-auto object-contain transition-transform duration-500 transform hover:scale-105"
                    />
                </div>
                <div className="bg-black/30 backdrop-blur-sm rounded-lg shadow-2xl flex flex-col p-6 text-gray-200">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-3xl font-bold text-white pr-4">{currentSofa.name}</h2>
                         <button onClick={() => speak(currentSofa.description)} className="p-2 text-gray-400 hover:text-amber-300 transition-colors flex-shrink-0" title="Озвучить описание">
                            <VoiceIcon className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="overflow-y-auto pr-2 flex-grow">
                        {currentSofa.description.split('\n').map((line, index) => (
                            <p key={index} className="mb-2 leading-relaxed text-base">{line}</p>
                        ))}
                    </div>
                </div>
            </main>

            <footer className="mt-6 flex-shrink-0">
                <div className="bg-black/30 backdrop-blur-sm rounded-lg shadow-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex flex-wrap justify-center gap-2">
                        {sofaData.map(sofa => (
                            <button
                                key={sofa.id}
                                onClick={() => handleSofaSelect(sofa.id)}
                                className={`w-12 h-12 text-lg rounded-md transition-all duration-200 border-2 ${currentSofaId === sofa.id && !isChoosing ? 'bg-amber-300 text-black border-amber-300 scale-110' : 'bg-gray-700/50 text-gray-300 border-gray-600 hover:bg-gray-600/50 hover:border-gray-500'} ${isChoosing && currentSofaId === sofa.id ? 'bg-amber-400 animate-pulse' : ''}`}
                            >
                                {sofa.id}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={handleRandomSelect}
                        disabled={isChoosing}
                        className="font-magic w-full md:w-auto text-lg px-6 py-3 bg-amber-300 text-gray-900 rounded-lg transition-all duration-300 transform hover:scale-105 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    >
                        {isChoosing ? "Предсказание..." : "Диван выбирает тебя"}
                    </button>
                    <button 
                      onClick={handleContact}
                      className="w-full md:w-auto text-md px-6 py-3 bg-transparent border-2 border-gray-400 text-gray-300 rounded-lg hover:bg-gray-300 hover:text-gray-900 transition-colors duration-300"
                    >
                        Связаться с продавцом
                    </button>
                </div>
            </footer>
        </div>
    );
};
