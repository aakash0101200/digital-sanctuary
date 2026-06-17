import React from 'react';
import { FREQUENCIES, getFrequencyById } from '../constants/frequencies';

export default function EmotionalSpectrum({ frequencyCounts, totalTagged }) {
    if (totalTagged < 3) {
        return (
            <div className="mb-8 text-center">
                <h3 className="block text-[10px] tracking-widest uppercase opacity-50 mb-3">
                    Your Inner Spectrum
                </h3>
                <p className="text-[11px] text-sanctuary-ink opacity-40 italic leading-relaxed">
                    Share more thoughts with an emotional frequency<br />
                    to reveal your inner spectrum.
                </p>
            </div>
        );
    }

    // Find dominant frequency
    let dominantId = null;
    let dominantCount = 0;
    for (const [id, count] of Object.entries(frequencyCounts)) {
        if (count > dominantCount) {
            dominantCount = count;
            dominantId = id;
        }
    }

    const dominantFreq = getFrequencyById(dominantId);

    return (
        <div className="mb-8">
            <h3 className="block text-[10px] tracking-widest uppercase opacity-50 mb-4 text-left">
                Your Inner Spectrum
            </h3>

            {/* Spectrum bar */}
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-sanctuary-stone bg-opacity-10">
                {FREQUENCIES.map(freq => {
                    const count = frequencyCounts[freq.id] || 0;
                    if (count === 0) return null;
                    const widthPercent = (count / totalTagged) * 100;

                    return (
                        <div
                            key={freq.id}
                            title={`${freq.name}: ${count} thought${count !== 1 ? 's' : ''}`}
                            style={{
                                width: `${widthPercent}%`,
                                backgroundColor: freq.color,
                                minWidth: '4px',
                            }}
                            className="transition-all duration-500 first:rounded-l-full last:rounded-r-full"
                        />
                    );
                })}
            </div>

            {/* Legend dots */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 justify-center">
                {FREQUENCIES.map(freq => {
                    const count = frequencyCounts[freq.id] || 0;
                    if (count === 0) return null;
                    return (
                        <div key={freq.id} className="flex items-center gap-1.5">
                            <div
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: freq.color }}
                            />
                            <span className="text-[9px] tracking-wider uppercase opacity-50">
                                {freq.name}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Dominant frequency */}
            {dominantFreq && (
                <p className="text-[11px] text-center mt-3 opacity-50 italic">
                    Your presence resonates most with{' '}
                    <span style={{ color: dominantFreq.color }} className="font-medium not-italic">
                        {dominantFreq.name}
                    </span>
                </p>
            )}
        </div>
    );
}
