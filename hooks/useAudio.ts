import { useCallback, useEffect } from 'react';

// Free sound effects from Pixabay
const CLICK_SOUND_URL = 'https://cdn.pixabay.com/audio/2022/03/15/audio_2415ddf9ac.mp3';
const SHUFFLE_SOUND_URL = 'https://cdn.pixabay.com/audio/2022/11/17/audio_8857242d54.mp3';
const TRIUMPH_SOUND_URL = 'https://cdn.pixabay.com/audio/2022/09/23/audio_73b9e4a3aa.mp3';

export const useAudio = (isMuted: boolean) => {
    // Preload audio files
    useEffect(() => {
        new Audio(CLICK_SOUND_URL);
        new Audio(SHUFFLE_SOUND_URL);
        new Audio(TRIUMPH_SOUND_URL);
    }, []);

    const playSound = useCallback((src: string, volume = 1.0) => {
        if (!isMuted) {
            const audio = new Audio(src);
            audio.volume = volume;
            audio.play().catch(e => console.error("Audio playback failed:", e));
        }
    }, [isMuted]);

    const playClickSound = useCallback(() => playSound(CLICK_SOUND_URL, 0.5), [playSound]);
    const playShuffleSound = useCallback(() => playSound(SHUFFLE_SOUND_URL, 0.7), [playSound]);
    const playTriumphSound = useCallback(() => playSound(TRIUMPH_SOUND_URL, 0.6), [playSound]);

    const speak = useCallback((text: string) => {
        if (!isMuted && 'speechSynthesis' in window) {
            speechSynthesis.cancel(); // Stop any previous speech
            const cleanText = text.replace(/([✨🌙☀️🌳⏳▫️*])/g, ''); // Remove symbols and markdown for cleaner speech
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.lang = 'ru-RU';
            speechSynthesis.speak(utterance);
        }
    }, [isMuted]);
    
    const stopSpeaking = useCallback(() => {
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
        }
    }, []);

    useEffect(() => {
        // Stop speech synthesis if muted is turned on
        if (isMuted) {
            stopSpeaking();
        }
    }, [isMuted, stopSpeaking]);

    return { playClickSound, playShuffleSound, playTriumphSound, speak, stopSpeaking };
};
