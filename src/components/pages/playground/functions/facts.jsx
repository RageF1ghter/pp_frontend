import { useEffect, useState } from "react";

export default function Facts() {
	const [facts, setFacts] = useState([]);
	const [display, setDisplay] = useState([]);
	const [page, setPage] = useState(1);
	const handleFetch = async () => {
		try {
			const response = await fetch(
				"https://uselessfacts.jsph.pl/random.json?language=en"
			);
			const data = await response.json();
			if (data && data.text) {
				// console.log(data);
				setFacts((prevFacts) => [...prevFacts, data]);
			} else {
				console.error("Unexpected API response:", data);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handlePrev = () => {
		if (page > 1) {
			setPage(page - 1);
		}
	};

	const handleNext = () => {
		if (page < Math.ceil(facts.length / 5)) {
			setPage(page + 1);
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			const fetchPromises = Array.from({ length: 10 }, () => handleFetch());
			await Promise.all(fetchPromises);
		};
		fetchData();
	}, []);

	useEffect(() => {
		if (facts.length === 0) {
			setDisplay([]);
			return;
		}
		setDisplay(
			facts.slice((page - 1) * 5, Math.min(page * 5, facts.length - 1))
		);
	}, [facts, page]);

	return (
		<>
			<h1>Fun facts</h1>
			<ul className="facts-container">
				{display.length > 0 ? (
					display.map((item) => (
						<li key={item.id} className="fact-item">
							<div>
								<p>{item.text}</p>
								<a href={item.source_url}>Link</a>
							</div>
						</li>
					))
				) : (
					<p>No facts available</p>
				)}
			</ul>
			<button onClick={handlePrev}>Prev</button>
			<button onClick={handleNext}>Next</button>
		</>
	);
}
