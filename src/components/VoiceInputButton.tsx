import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Square, Radio } from 'lucide-react';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  mode?: 'replace' | 'append';
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'pill' | 'bar';
  className?: string;
  title?: string;
  label?: string;
}

// Support standard and webkit prefix for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscript,
  mode = 'append',
  size = 'sm',
  variant = 'pill',
  className = '',
  title = 'Click to dictate voice observation',
  label = 'Tap to Dictate Audio Observation',
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [interimText, setInterimText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setInterimText('');
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        let final = '';
        let interim = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (interim) {
          setInterimText(interim);
        }

        if (final) {
          onTranscript(final.trim());
          setInterimText('');
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition event/error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMessage('Microphone access denied. Please allow microphone permissions.');
        }
        setIsListening(false);
        setInterimText('');
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimText('');
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('SpeechRecognition initialization error:', e);
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
    };
  }, [onTranscript]);

  const toggleListening = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSupported) {
      setErrorMessage('Voice dictation is supported in modern Chrome, Edge, and Safari.');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (_) {}
      setIsListening(false);
      setInterimText('');
    } else {
      setErrorMessage(null);
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.warn('Could not start recognition:', err);
      }
    }
  };

  if (!isSupported) {
    return null;
  }

  // Variant: Pill or Bar button (under dialogue box)
  if (variant === 'pill' || variant === 'bar') {
    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        <button
          type="button"
          onClick={toggleListening}
          id="observation-voice-mic-btn"
          title={isListening ? 'Listening... click to stop recording' : title}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none ${
            isListening
              ? 'bg-red-600 hover:bg-red-700 text-white shadow-sm ring-2 ring-red-300 animate-pulse'
              : 'bg-[#F3F4F6] hover:bg-[#EBF4FD] text-[#374151] hover:text-[#0077B5] border border-[#E5E7EB] hover:border-[#BFDBFE]'
          }`}
        >
          {isListening ? (
            <>
              <Square className="w-3.5 h-3.5 text-white fill-current animate-bounce" />
              <span>Recording... Tap to Finish</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
            </>
          ) : (
            <>
              <Mic className="w-3.5 h-3.5 text-[#0077B5]" />
              <span>{label}</span>
              <span className="text-[10px] text-[#6B7280] font-normal hidden sm:inline">(Hands-free dictation)</span>
            </>
          )}
        </button>

        {/* Live Listening Transcript / Status */}
        {isListening && (
          <div className="bg-[#111827] text-white text-xs px-3 py-2 rounded-lg flex items-center gap-2 shadow-md animate-fadeIn">
            <Radio className="w-4 h-4 text-red-400 animate-pulse shrink-0" />
            <div className="truncate">
              <span className="text-gray-400 font-medium mr-1.5">Listening:</span>
              <span className="text-white italic">
                {interimText ? `"${interimText}..."` : 'Speak your daily notes, numbers, or meeting takeaways...'}
              </span>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded">
            {errorMessage}
          </div>
        )}
      </div>
    );
  }

  // Variant: Icon button
  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={toggleListening}
        title={isListening ? 'Listening... click to stop' : title}
        className={`relative transition-all flex items-center justify-center rounded-full cursor-pointer ${
          isListening
            ? 'bg-red-500 text-white ring-4 ring-red-200 animate-pulse'
            : 'bg-[#F3F2EF] hover:bg-[#EBF4FD] text-[#555555] hover:text-[#0077B5] border border-[#E0DFDC]'
        } ${size === 'sm' ? 'p-1.5' : 'p-2'} ${className}`}
      >
        {isListening ? (
          <Mic className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-white animate-bounce`} />
        ) : (
          <Mic className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
        )}
      </button>

      {isListening && (
        <div className="absolute right-0 top-full mt-1.5 z-50 bg-[#191919] text-white text-[11px] font-medium px-2.5 py-1 rounded shadow-lg whitespace-nowrap flex items-center gap-1.5 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
          <span>{interimText ? `"${interimText}..."` : 'Listening to your voice...'}</span>
        </div>
      )}
    </div>
  );
};
