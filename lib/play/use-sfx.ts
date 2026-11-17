"use client";

import { useEffect, useRef, useState } from "react";

// 模擬抓周的音效：用 Web Audio 即時合成，不用下載音效檔。
// iOS 規定要在使用者點擊時才能出聲，所以在按「開始抓周」時呼叫 unlock()。
// 開關存在 localStorage（只是個人偏好，讀寫失敗就用預設：開）。

const STORAGE_KEY = "zhuazhou.sound";

type Tone = {
  freq: number;
  /** 從現在起幾秒後開始 */
  at: number;
  duration: number;
  type?: OscillatorType;
  volume?: number;
  /** 結尾滑到的頻率（做出「啵」的感覺） */
  slideTo?: number;
};

const readEnabled = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
};

export const useSfx = () => {
  const ctx = useRef<AudioContext | null>(null);
  const [enabled, setEnabled] = useState(true);

  // localStorage 只能在瀏覽器讀，掛載後再同步，避免 hydration 不一致
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 掛載後讀一次個人偏好
    setEnabled(readEnabled());
  }, []);

  useEffect(() => () => void ctx.current?.close(), []);

  const unlock = () => {
    if (!enabled) return;
    try {
      ctx.current ??= new AudioContext();
      if (ctx.current.state === "suspended") void ctx.current.resume();
    } catch {
      // 不支援 Web Audio 就安靜地玩
    }
  };

  const play = (tones: Tone[]) => {
    const ac = ctx.current;
    if (!enabled || !ac || ac.state !== "running") return;
    const now = ac.currentTime;
    for (const t of tones) {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = t.type ?? "sine";
      const start = now + t.at;
      const end = start + t.duration;
      osc.frequency.setValueAtTime(t.freq, start);
      if (t.slideTo) osc.frequency.exponentialRampToValueAtTime(t.slideTo, end);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(t.volume ?? 0.18, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, end);
      osc.connect(gain).connect(ac.destination);
      osc.start(start);
      osc.stop(end + 0.02);
    }
  };

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
    } catch {
      // 存不了就只在這次有效
    }
    if (!next) void ctx.current?.suspend();
    else void ctx.current?.resume();
  };

  return {
    enabled,
    toggle,
    unlock,
    /** 快速模式跑馬燈每跳一格 */
    tick: () =>
      play([{ freq: 880, at: 0, duration: 0.05, type: "triangle", volume: 0.08 }]),
    /** 摸一下物品／抓起來 */
    pop: () =>
      play([{ freq: 520, slideTo: 1100, at: 0, duration: 0.12, volume: 0.16 }]),
    /** 結果揭曉：上行的小號角 */
    fanfare: () =>
      play(
        [523.25, 659.25, 783.99, 1046.5].map((freq, i) => ({
          freq,
          at: i * 0.11,
          duration: i === 3 ? 0.55 : 0.16,
          type: "triangle" as const,
          volume: 0.16,
        })),
      ),
  };
};
