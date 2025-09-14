import Facts from "./functions/facts";
import Calculator from "./calculator";
import VoiceLevelMeter from "./functions/db_meter";
import { Link, Route, Routes } from "react-router-dom";
// import "./playground.css";

function Playground() {
	const functions = [
		{ name: "Calculator", path: "calculator", enabled: true },
		{ name: "Facts", path: "facts", enabled: true },
		{ name: "DB Meter", path: "db_meter", enabled: true },
		{ name: "BlackJack Game", path: "blackjack", enabled: false },
	];
	const colClasses = {
		1: "grid-cols-1",
		2: "grid-cols-2",
		3: "grid-cols-3",
		4: "grid-cols-4",
		0: "grid-cols-5", // when divisible by 5
	};

	const rowClasses = {
		1: "grid-rows-1",
		2: "grid-rows-2",
		3: "grid-rows-3",
		4: "grid-rows-4",
		5: "grid-rows-5",
		// extend as needed
	};
	// console.log(functions.length % 5, Math.ceil(functions.length / 5));
	return (
		<div>
			<div
				className={`grid ${colClasses[functions.length % 5]} ${
					rowClasses[Math.ceil(functions.length / 5)] || ""
				} gap-4 p-4 border-b border-gray-300 mb-4`}
			>
				{functions.map((func, index) => (
					<div
						className="p-5 border-2 border-black shadow-2xl shadow-gray-300 flex justify-center"
						key={index}
					>
						<Link
							to={func.enabled ? `/playground/${func.path}` : "/playground"}
						>
							{func.name}
						</Link>
					</div>
				))}
			</div>
			<Routes>
				<Route path="/" element={<h1>Pick the function!</h1>} />
				<Route path="facts" element={<Facts />} />
				<Route path="calculator" element={<Calculator />} />
				<Route
					path="db_meter"
					element={
						<VoiceLevelMeter
							autoStart={true}
							minDb={-80}
							maxDb={45}
							smoothing={0.9}
							// onLevel={(db) => console.log("level:", db.toFixed(1))}
						/>
					}
				/>
			</Routes>
		</div>
	);
}

export default Playground;
