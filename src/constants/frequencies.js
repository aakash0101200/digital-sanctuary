/**
 * States of Being — The Six Emotional Frequencies
 * 
 * Grounded in the Valence-Arousal dimensional model from affective psychology.
 * Each frequency captures a distinct region of human consciousness.
 */

export const FREQUENCIES = [
    {
        id: 'restless',
        name: 'Restless',
        color: '#c2785c',
        colorLight: 'rgba(194, 120, 92, 0.08)',
        colorMid: 'rgba(194, 120, 92, 0.15)',
        quote: '"Not all those who wander are lost."',
        author: '— J.R.R. Tolkien',
        description: 'The mind seeks what the heart cannot yet name.',
    },
    {
        id: 'contemplative',
        name: 'Contemplative',
        color: '#7c8a99',
        colorLight: 'rgba(124, 138, 153, 0.08)',
        colorMid: 'rgba(124, 138, 153, 0.15)',
        quote: '"The unexamined life is not worth living."',
        author: '— Socrates',
        description: 'Deep thought, philosophical inquiry, quiet wonder.',
    },
    {
        id: 'melancholic',
        name: 'Melancholic',
        color: '#8b7ea3',
        colorLight: 'rgba(139, 126, 163, 0.08)',
        colorMid: 'rgba(139, 126, 163, 0.15)',
        quote: '"The wound is the place where the Light enters you."',
        author: '— Rumi',
        description: 'Grief and longing carry their own quiet beauty.',
    },
    {
        id: 'peaceful',
        name: 'Peaceful',
        color: '#8a9a86',
        colorLight: 'rgba(138, 154, 134, 0.08)',
        colorMid: 'rgba(138, 154, 134, 0.15)',
        quote: '"In the middle of difficulty lies opportunity."',
        author: '— Albert Einstein',
        description: 'Stillness. Acceptance. The calm after understanding.',
    },
    {
        id: 'joyful',
        name: 'Joyful',
        color: '#c9a84c',
        colorLight: 'rgba(201, 168, 76, 0.08)',
        colorMid: 'rgba(201, 168, 76, 0.15)',
        quote: '"Happiness is not something ready made. It comes from your own actions."',
        author: '— Dalai Lama',
        description: 'Gratitude, warmth, and the light within.',
    },
    {
        id: 'awakened',
        name: 'Awakened',
        color: '#6b9e9e',
        colorLight: 'rgba(107, 158, 158, 0.08)',
        colorMid: 'rgba(107, 158, 158, 0.15)',
        quote: '"The only way to make sense out of change is to plunge into it, move with it, and join the dance."',
        author: '— Alan Watts',
        description: 'Clarity. Epiphany. The veil lifts.',
    },
];

/**
 * Lookup helpers
 */
export const getFrequencyById = (id) => FREQUENCIES.find(f => f.id === id) || null;

export const FREQUENCY_IDS = FREQUENCIES.map(f => f.id);
