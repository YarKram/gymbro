import { useEffect, useMemo, useState } from "react";
import trainings from "../trainings.json";
import "./App.css";

function App() {
	const [currentDate, setCurrentDate] = useState(new Date());

	const formattedDate = useMemo(() => {
		return currentDate.toLocaleString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			weekday: "short",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: false,
			timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		});
	}, [currentDate]);

	console.log(currentDate);

	const getInitialData = () => {
		// Retrieve data from localStorage if available, or initialize with default values
		const savedData = JSON.parse(localStorage.getItem("trainingData"));
		if (savedData === null || savedData === undefined) {
			return trainings.map(() => ({
				sets: 0,
				reps: 0,
				weight: 0,
				savedData: [], // Make sure each exercise has a 'savedData' property as an empty array
			}));
		}
		return savedData; // Return the saved data if available
	};

	const [trainingData, setTrainingData] = useState(getInitialData());

	useEffect(() => {
		// Save the current state in localStorage whenever it changes
		localStorage.setItem("trainingData", JSON.stringify(trainingData));
	}, [trainingData]);

	const handleSave = (index) => {
		const sets = parseInt(document.getElementById(`sets-${index}`).value, 10);
		const reps = parseInt(document.getElementById(`reps-${index}`).value, 10);
		const weight = parseInt(
			document.getElementById(`weight-${index}`).value,
			10
		);

		// Check if any of the input fields are empty
		if (isNaN(sets) || isNaN(reps) || isNaN(weight)) {
			alert("Please fill in all the input fields.");
			return;
		}

		const newTrainingData = [...trainingData];
		newTrainingData[index].savedData.push({
			sets,
			reps,
			weight,
			date: formattedDate, // Store the formatted date along with the data
		});
		setTrainingData(newTrainingData);

		// Update the current date and time after "Save" button is pressed
		setCurrentDate(new Date());
	};

	const handleRemove = (exerciseIndex, dataIndex) => {
		const newTrainingData = [...trainingData];
		newTrainingData[exerciseIndex].savedData.splice(dataIndex, 1);
		setTrainingData(newTrainingData);
	};

	return (
		<>
			<h1>Welcome to GymBro App</h1>
			<div>
				{trainings.map(({ exercise, link }, index) => (
					<div key={index}>
						<div
							style={{
								display: "flex",
								gap: "30px",
								marginBottom: "10px",
								alignItems: "center",
								flexWrap: "wrap",
							}}
						>
							<a href={link}>{exercise}</a>
							<input id={`sets-${index}`} placeholder="Кількість підходів" />
							<input id={`reps-${index}`} placeholder="Рази" />
							<input id={`weight-${index}`} placeholder="Вага" />
							<button type="button" onClick={() => handleSave(index)}>
								Save
							</button>
						</div>
						<div>
							{/* Display paragraphs only for the current exercise */}
							{trainingData[index] &&
								trainingData[index].savedData &&
								trainingData[index].savedData.map((data, dataIndex) => (
									<div
										key={dataIndex}
										style={{
											display: "flex",
											alignItems: "center",
											flexWrap: "wrap",
										}}
									>
										<p>
											Підходи: {data.sets}, Рази: {data.reps}, Вага:{" "}
											{data.weight}, Дата: {data.date}
										</p>
										<button
											type="button"
											onClick={() => handleRemove(index, dataIndex)}
										>
											Remove
										</button>
									</div>
								))}
						</div>
					</div>
				))}
			</div>
		</>
	);
}

export default App;
