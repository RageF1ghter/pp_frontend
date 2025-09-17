import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

/**
 * VoiceLevelMeter — monitors the microphone and displays a live dBFS level.
 *
 * Features
 * - Start/Stop control (optional autoStart)
 * - Calculates RMS -> dBFS in real time using Web Audio API
 * - Smoothing + peak hold
 * - Tailwind-based visual meter
 * - onLevel callback for external consumers
 *
 * Usage
 * <VoiceLevelMeter autoStart onLevel={(db)=>console.log(db)} />
 */
export default function VoiceLevelMeter({
	autoStart,
	minDb = -90, // floor for display
	maxDb = 0, // ceiling (dBFS)
	smoothing = 0.85, // 0..1 (higher = smoother)
	fftSize = 2048, // analyser buffer size; power of 2
	peakHoldMs = 1200,

	onLevel,
}: {
	autoStart?: boolean;
	minDb?: number;
	maxDb?: number;
	smoothing?: number;
	fftSize?:
		| 32
		| 64
		| 128
		| 256
		| 512
		| 1024
		| 2048
		| 4096
		| 8192
		| 16384
		| 32768;
	peakHoldMs?: number;
	className?: string;
	onLevel?: (db: number) => void;
}) {
	const [running, setRunning] = useState(autoStart);
	const [error, setError] = useState<string | null>(null);
	const [dbDisplay, setDbDisplay] = useState<number>(minDb);
	// const [peakDb, setPeakDb] = useState<number>(minDb);

	// Refs for Web Audio pieces
	const audioCtxRef = useRef<AudioContext | null>(null);
	const analyserRef = useRef<AnalyserNode | null>(null);
	const mediaStreamRef = useRef<MediaStream | null>(null);
	const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
	const rafRef = useRef<number | null>(null);
	const lastPeakTsRef = useRef<number>(0);
	const peakDbRef = useRef<number>(minDb);
	const currDbRef = useRef<number>(minDb);

	// references for diffferent dB levels
	const soundReferences = [
		{ label: "Breathing", dbfs: 10 - 90 }, // -80
		{ label: "Whisper", dbfs: 25 - 90 }, // -65
		{ label: "Background Noise", dbfs: -45 }, // -55
		{ label: "Tiktok", dbfs: -30 }, // -30

		{ label: "Conversation", dbfs: -20 },
		// { label: "Vacuum cleaner", dbfs: 75 - 90 }, // -15
		{ label: "Lawnmower", dbfs: 88 - 90 }, //  -2
		{ label: "Car horn", dbfs: 105 - 90 }, // +15 (clamp to 0 later)
		// { label: "Chainsaw", dbfs: 110 - 90 }, // +20
		{ label: "Rock concert", dbfs: 115 - 90 }, // +25
		{ label: "Jet engine", dbfs: 135 - 90 }, // +45
		// { label: "Fireworks / gunshot", dbfs: 155 - 90 }, // +65
	];

	// Compute normalized 0..1 amount from dB range
	const normalize = useCallback(
		(db: number) => {
			const clamped = Math.max(minDb, Math.min(maxDb, db));
			return (clamped - minDb) / (maxDb - minDb);
		},
		[minDb, maxDb]
	);

	const stop = useCallback(() => {
		if (rafRef.current) {
			cancelAnimationFrame(rafRef.current);
			rafRef.current = null;
		}
		try {
			sourceRef.current?.disconnect();
			analyserRef.current?.disconnect();
		} catch {}
		mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
		sourceRef.current = null;
		analyserRef.current = null;
		mediaStreamRef.current = null;

		if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
			audioCtxRef.current.close().catch(() => {});
		}
		audioCtxRef.current = null;

		setRunning(false);
	}, []);

	const frameLoop = useCallback(() => {
		const analyser = analyserRef.current;
		if (!analyser) return;

		const timeData = new Uint8Array(analyser.fftSize);
		analyser.getByteTimeDomainData(timeData);

		// Convert to [-1, 1] floats and compute RMS
		let sumSquares = 0;
		for (let i = 0; i < timeData.length; i++) {
			const v = (timeData[i] - 128) / 128; // center around 0
			sumSquares += v * v;
		}
		const rms = Math.sqrt(sumSquares / timeData.length) || 1e-12; // avoid log(0)

		// dBFS: 20 * log10(rms)
		let db = 20 * Math.log10(rms);
		if (!isFinite(db)) db = minDb;

		// Get the current dB
		currDbRef.current = db;
		const currDb = Math.max(minDb, Math.min(maxDb, currDbRef.current));

		// Peak hold
		const now = performance.now();
		if (currDb > peakDbRef.current) {
			peakDbRef.current = currDb;
			// console.log("set peak", peakDbRef.current);
			lastPeakTsRef.current = now;
		} else if (now - lastPeakTsRef.current > peakHoldMs) {
			// decay peak slowly
			peakDbRef.current = currDb;
		}
		// console.log(currDb, peakDbRef.current);
		setDbDisplay(currDb);
		onLevel?.(currDb);

		rafRef.current = requestAnimationFrame(frameLoop);
	}, [running, minDb, maxDb, peakHoldMs, onLevel]);

	const start = useCallback(async () => {
		setError(null);
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: false,
			});
			mediaStreamRef.current = stream;

			const ctx = new (window.AudioContext ||
				(window as any).webkitAudioContext)();
			audioCtxRef.current = ctx;

			const analyser = ctx.createAnalyser();
			analyser.fftSize = fftSize;
			analyser.smoothingTimeConstant = 0; // we smooth in code
			analyserRef.current = analyser;

			const source = ctx.createMediaStreamSource(stream);
			sourceRef.current = source;
			source.connect(analyser);

			setRunning(true);
			rafRef.current = requestAnimationFrame(frameLoop);
		} catch (e: any) {
			console.error(e);
			setError(
				e?.message ?? "Microphone permission denied or unsupported browser."
			);
			stop();
		}
	}, [fftSize, frameLoop, stop]);

	useEffect(() => {
		if (autoStart) {
			start();
		}
		return () => stop();
	}, []);

	const peakPct = useMemo(
		() => normalize(peakDbRef.current) * 100,
		[peakDbRef.current, normalize]
	);
	const levelPct = useMemo(
		() => normalize(dbDisplay) * 100,
		[dbDisplay, normalize]
	);
	const marks = useMemo(() => {
		const normalizedMarks = soundReferences.map((r) => {
			return { ...r, pct: normalize(r.dbfs) * 100 };
		});
		console.log(normalizedMarks);
		return normalizedMarks;
	}, [normalize]);

	return (
		<div className={`h-full max-w-xl select-none px-20 py-10`}>
			<div className="flex items-center justify-between mb-2">
				<div className="text-sm text-gray-500">Mic level (dBFS)</div>
				<div className="text-sm tabular-nums">
					{dbDisplay.toFixed(0)} dB
					<span className="text-gray-400">
						{" "}
						(peak {peakDbRef.current.toFixed(1)} dB)
					</span>
				</div>
			</div>

			<div className="flex items-start gap-3">
				{/* Vertical meter track */}
				<div className="relative h-64 w-6 bg-gray-200 overflow-hidden shadow-inner rounded">
					{/* Live level fill: bottom -> top */}
					<div
						className="absolute left-0 bottom-0 w-full bg-green-400"
						style={{ height: `${levelPct}%` }}
					/>

					{/* Peak marker: thin horizontal line */}
					<div
						className="absolute left-0 w-full h-0.5 bg-red-500"
						style={{ bottom: `${peakPct}%` }}
					/>

					{/* Reference ticks: thin horizontal lines */}
					{marks.map((m, i) => (
						<div
							key={i}
							className="absolute left-0 w-full h-px bg-gray-300"
							style={{ bottom: `${m.pct}%` }}
						/>
					))}
				</div>

				<div className="relative h-64 flex-1">
					{marks.map((m, i) => (
						<div
							key={i}
							className="absolute left-0 -translate-y-1/2 text-xs text-gray-500"
							style={{ top: `${100 - m.pct}%` }}
						>
							{m.label} ({m.dbfs} dB)
						</div>
					))}
				</div>
			</div>

			<div className="mt-3 flex gap-2">
				{!running ? (
					<button
						onClick={start}
						className="px-3 py-1.5 rounded-xl bg-black text-white shadow hover:opacity-90"
					>
						Start
					</button>
				) : (
					<button
						onClick={stop}
						className="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-900 shadow hover:bg-gray-200"
					>
						Stop
					</button>
				)}
				<span className="text-xs text-gray-500 self-center">
					Range: {minDb} to {maxDb} dBFS
				</span>
			</div>

			{error && <div className="mt-3 text-xs text-red-600">{error}</div>}
		</div>
	);
}
