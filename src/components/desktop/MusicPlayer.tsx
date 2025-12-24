import { Play, Pause, Music2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface Track {
  title: string;
  artist: string;
  src: string;
  cover?: string;
  description?: string;
}

interface MusicPlayerProps {
  track: Track;
  className?: string;
}

const formatTime = (value: number) => {
  if (!Number.isFinite(value) || value < 0) {
    return '00:00';
  }
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export function MusicPlayer({ track, className }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    // 当曲目发生变化时，重置播放器
    audio.pause();
    audio.currentTime = 0;
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);

    // 触发浏览器重新加载音频源
    audio.load();
  }, [track.src]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('无法播放音频', error);
    }
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const value = Number(event.target.value);
    audio.currentTime = value;
    setCurrentTime(value);
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={cn(
        'border border-border rounded-3xl p-6 bg-card/80 backdrop-blur',
        'shadow-sm flex flex-col gap-6',
        className
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/40 to-primary flex items-center justify-center text-primary-foreground"
          style={track.cover ? { backgroundImage: `url(${track.cover})`, backgroundSize: 'cover' } : undefined}
        >
          {!track.cover && <Music2 className="w-8 h-8" />}
        </div>
        <div>
          <p className="text-xs font-mono text-muted-foreground tracking-widest">MUSIC NOTE</p>
          <h3 className="text-xl font-serif">{track.title}</h3>
          <p className="text-sm text-muted-foreground">{track.artist}</p>
          {track.description && (
            <p className="text-xs text-muted-foreground mt-2">{track.description}</p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
            aria-label={isPlaying ? '暂停' : '播放'}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>

          <div className="flex-1">
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              disabled={!duration}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1 font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <audio ref={audioRef} src={track.src} preload="metadata" />
    </div>
  );
}
