import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

// --------------- Types ---------------
type TrackType = "vocal" | "synth" | "instrumental";

interface MusicPlayerState {
  selectedTrack: TrackType;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  showMusicDropdown: boolean;
  showPlayerFloat: boolean;
  setSelectedTrack: (track: TrackType) => void;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (vol: number) => void;
  setIsMuted: (muted: boolean) => void;
  setShowMusicDropdown: (show: boolean) => void;
  setShowPlayerFloat: (show: boolean) => void;
  handleTrackChange: (track: TrackType) => void;
}

const MusicPlayerContext = createContext<MusicPlayerState | null>(null);

export function useMusicPlayer() {
  const ctx = useContext(MusicPlayerContext);
  if (!ctx) throw new Error("useMusicPlayer must be used within MusicPlayerProvider");
  return ctx;
}

// --------------- Melody Data ---------------
const BUNGONG_JEUMPA_MELODY = [
  { freq: 392.00, dur: 0.4 }, { freq: 392.00, dur: 0.4 }, { freq: 440.00, dur: 0.4 }, { freq: 493.88, dur: 0.8 },
  { freq: 493.88, dur: 0.4 }, { freq: 440.00, dur: 0.4 }, { freq: 392.00, dur: 0.4 }, { freq: 440.00, dur: 0.8 },
  { freq: 493.88, dur: 0.4 }, { freq: 493.88, dur: 0.4 }, { freq: 440.00, dur: 0.4 }, { freq: 392.00, dur: 0.8 },
  { freq: 440.00, dur: 0.4 }, { freq: 493.88, dur: 0.4 }, { freq: 523.25, dur: 0.8 }, { freq: 493.88, dur: 0.4 },
  { freq: 440.00, dur: 0.4 }, { freq: 392.00, dur: 1.0 },
  { freq: 392.00, dur: 0.4 }, { freq: 392.00, dur: 0.4 }, { freq: 440.00, dur: 0.4 }, { freq: 493.88, dur: 0.8 },
  { freq: 493.88, dur: 0.4 }, { freq: 440.00, dur: 0.4 }, { freq: 392.00, dur: 0.4 }, { freq: 440.00, dur: 0.8 },
  { freq: 493.88, dur: 0.4 }, { freq: 493.88, dur: 0.4 }, { freq: 440.00, dur: 0.4 }, { freq: 392.00, dur: 0.8 },
  { freq: 440.00, dur: 0.4 }, { freq: 493.88, dur: 0.4 }, { freq: 523.25, dur: 0.8 }, { freq: 493.88, dur: 0.4 },
  { freq: 440.00, dur: 0.4 }, { freq: 392.00, dur: 1.0 },
  { freq: 523.25, dur: 0.6 }, { freq: 523.25, dur: 0.6 }, { freq: 493.88, dur: 0.4 }, { freq: 440.00, dur: 0.8 },
  { freq: 493.88, dur: 0.4 }, { freq: 523.25, dur: 0.4 }, { freq: 493.88, dur: 0.8 }, { freq: 440.00, dur: 0.4 },
  { freq: 392.00, dur: 0.4 }, { freq: 440.00, dur: 0.8 },
  { freq: 493.88, dur: 0.4 }, { freq: 493.88, dur: 0.4 }, { freq: 440.00, dur: 0.4 }, { freq: 392.00, dur: 0.8 },
  { freq: 440.00, dur: 0.4 }, { freq: 493.88, dur: 0.4 }, { freq: 523.25, dur: 0.8 }, { freq: 493.88, dur: 0.4 },
  { freq: 440.00, dur: 0.4 }, { freq: 392.00, dur: 1.2 },
];

// --------------- Provider Component ---------------
export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const [selectedTrack, setSelectedTrack] = useState<TrackType>("vocal");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(60);
  const [isMuted, setIsMuted] = useState(false);
  const [showMusicDropdown, setShowMusicDropdown] = useState(false);
  const [showPlayerFloat, setShowPlayerFloat] = useState(true);

  const audioStreamRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<any>(null);
  const noteIndexRef = useRef<number>(0);

  const vocalSourcesRef = useRef<string[]>([
    "/assets/audio/Bungong_Jeumpa.mp3",
    "/Bungong_Jeumpa.mp3",
    "/bungong_jeumpa.mp3",
    "https://raw.githubusercontent.com/fawwaz/indonesian-folk-songs/master/audio/aceh_bungong_jeumpa.mp3"
  ]);
  const currentSourceIdxRef = useRef<number>(0);

  // --- Start / Stop Synth ---
  const stopSynth = useCallback(() => {
    if (synthIntervalRef.current) {
      clearTimeout(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
  }, []);

  const startSynth = useCallback(() => {
    stopSynth();
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
      audioCtxRef.current = new AudioContextClass();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();

    noteIndexRef.current = 0;

    const playNextNote = () => {
      if (!isPlaying || selectedTrack !== "synth" || ctx.state === "closed") return;

      const note = BUNGONG_JEUMPA_MELODY[noteIndexRef.current];
      if (!note) {
        noteIndexRef.current = 0;
        playNextNote();
        return;
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(note.freq, ctx.currentTime);

      const now = ctx.currentTime;
      const duration = note.dur;
      const currentVolume = isMuted ? 0 : volume / 100;

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.18 * currentVolume, now + 0.04);
      gain.gain.setValueAtTime(0.18 * currentVolume, now + duration - 0.06);
      gain.gain.linearRampToValueAtTime(0, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration);

      noteIndexRef.current = (noteIndexRef.current + 1) % BUNGONG_JEUMPA_MELODY.length;
      synthIntervalRef.current = setTimeout(playNextNote, duration * 1000);
    };

    playNextNote();
  }, [isPlaying, selectedTrack, volume, isMuted, stopSynth]);

  // --- Initialize Audio Element ---
  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.crossOrigin = "anonymous";
    audioStreamRef.current = audio;

    currentSourceIdxRef.current = 0;
    audio.src = vocalSourcesRef.current[0];

    const handleError = () => {
      if (selectedTrack === "vocal" && currentSourceIdxRef.current < vocalSourcesRef.current.length - 1) {
        currentSourceIdxRef.current += 1;
        const nextSrc = vocalSourcesRef.current[currentSourceIdxRef.current];
        console.log("Audio source failed. Falling back to source " + currentSourceIdxRef.current + ": " + nextSrc);
        audio.src = nextSrc;
        if (isPlaying) {
          audio.play().catch(err => console.log("Failed to play fallback:", err));
        }
      }
    };

    audio.addEventListener("error", handleError);

    return () => {
      audio.pause();
      audio.removeEventListener("error", handleError);
      stopSynth();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []); // Only run once on mount

  // --- Sync Volume ---
  useEffect(() => {
    if (audioStreamRef.current) {
      audioStreamRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  // --- Handle Play/Pause & Track Transitions ---
  useEffect(() => {
    if (!isPlaying) {
      if (audioStreamRef.current) audioStreamRef.current.pause();
      stopSynth();
      return;
    }

    if (selectedTrack === "synth") {
      if (audioStreamRef.current) audioStreamRef.current.pause();
      startSynth();
    } else {
      stopSynth();
      if (audioStreamRef.current) {
        let streamUrl = "";
        if (selectedTrack === "vocal") {
          streamUrl = vocalSourcesRef.current[currentSourceIdxRef.current];
        } else {
          streamUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3";
        }

        if (audioStreamRef.current.src !== streamUrl) {
          audioStreamRef.current.src = streamUrl;
        }

        audioStreamRef.current.play().catch(err => {
          console.warn("Autoplay or stream load prevented by browser:", err);
          if (selectedTrack === "vocal" && currentSourceIdxRef.current < vocalSourcesRef.current.length - 1) {
            currentSourceIdxRef.current += 1;
            audioStreamRef.current!.src = vocalSourcesRef.current[currentSourceIdxRef.current];
            audioStreamRef.current!.play().catch(() => {});
          } else {
            setIsPlaying(false);
          }
        });
      }
    }
  }, [isPlaying, selectedTrack, startSynth, stopSynth]);

  const handleTrackChange = useCallback((track: TrackType) => {
    setSelectedTrack(track);
    setIsPlaying(true);
    setShowMusicDropdown(false);
  }, []);

  const value: MusicPlayerState = {
    selectedTrack,
    isPlaying,
    volume,
    isMuted,
    showMusicDropdown,
    showPlayerFloat,
    setSelectedTrack,
    setIsPlaying,
    setVolume,
    setIsMuted,
    setShowMusicDropdown,
    setShowPlayerFloat,
    handleTrackChange,
  };

  return React.createElement(MusicPlayerContext.Provider, { value }, children);
}

