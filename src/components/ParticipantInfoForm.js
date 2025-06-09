// src/components/ParticipantInfoForm.js
import React, { useState } from "react";
import { ratingLabels } from "../data/images";

function ParticipantInfoForm({ onSubmit }) {
	const [age, setAge] = useState("");
	const [gender, setGender] = useState("");
	const [deviceType, setDeviceType] = useState("");

	const deviceOptions = [
		"Komputer stacjonarny",
		"Laptop",
		"Smartfon",
		"Tablet",
		"Inne",
	];

	const genderOptions = [
		{ value: "male", label: "Mężczyzna" },
		{ value: "female", label: "Kobieta" },
	];

	const handleSubmit = e => {
		e.preventDefault();
		if (!gender) {
			alert("Proszę wybrać płeć.");
			return;
		}
		if (!age.trim() || parseInt(age, 10) <= 0) {
			alert("Proszę podać prawidłowy wiek.");
			return;
		}
		if (!deviceType) {
			alert("Proszę wybrać rodzaj urządzenia.");
			return;
		}
		onSubmit({ age, gender, deviceType }); // Usunięto participantId
	};

	return (
		<div className="form-container">
			<p>
				Zadaniem poniższej ankiety jest zbadanie wpływu degradacji plików
				obrazowych na jakość obrazu rekonstruowanego.
			</p>
			<p>
				W pierwszym etapie ankiety należy podać swój wiek, płeć oraz rodzaj
				urządzenia z którego się obecnie korzysta.
			</p>
			<p>
				Drugi etap polega na ocenie jakości obrazu rekonstruowanego
				(dolnego/prawego) w porównaniu do obrazu referencyjnego
				(górnego/lewego). Należy wybrać jedną z podanych opcji, której opis
				najbardziej odzwierciedla jakość obrazu rekonstruowanego. Na każdy obraz
				referencyjny przypada określona ilość obrazów ocenianych, zatem obraz
				referencyjny zmienia się po przypisaniu oceny do pewnej liczby obrazów.
			</p>
			<p>
				Ankieta jest w pełni anonimowa, a jej wynik zostanie użyty wyłącznie w
				celu przeprowadzenia badania w ramach pracy magisterskiej pt.{" "}
				<i>
					"Wpływ degradacji zawartości plików wybranych formatów stratnej
					kompresji obrazu na jakość obrazu rekonstruowanego"
				</i>
				.
			</p>
			<p>
				<b>
					Przewidywany czas wypełnienia ankiety: <u>5-10 minut</u>. Brak
					możliwości powrotu do poprzednich pytań.
				</b>
			</p>
			<p>
				Wyjaśnienie skali oceniania obrazów:
				<ul>
					{ratingLabels.map(item => (
						<li key={item.value}>
							<b>{item.label}</b> - {item.description}
						</li>
					))}
				</ul>
			</p>
			<hr></hr>
			<h2>Informacje o Uczestniku</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="age">Podaj swój wiek:</label>
					<input
						type="number"
						id="age"
						name="age" // Dodano name dla lepszej praktyki
						value={age}
						onChange={e => setAge(e.target.value)}
						min="1"
						required
						placeholder="18"
					/>
				</div>

				<fieldset className="form-fieldset">
					{" "}
					{/* Używamy fieldset dla grupy radio */}
					<legend>Wybierz swoją płeć:</legend>
					{genderOptions.map(option => (
						<div key={option.value} className="radio-option">
							<input
								type="radio"
								id={`gender-${option.value}`}
								name="gender"
								value={option.value}
								checked={gender === option.value}
								onChange={e => setGender(e.target.value)}
								required
							/>
							<label htmlFor={`gender-${option.value}`}>{option.label}</label>
						</div>
					))}
				</fieldset>

				<fieldset className="form-fieldset">
					<legend>Na jakim urządzeniu wykonujesz ankietę?</legend>
					{deviceOptions.map(option => (
						<div key={option} className="radio-option">
							<input
								type="radio"
								id={`device-${option.replace(/\s+/g, "-").toLowerCase()}`} // Tworzenie unikalnego ID
								name="deviceType"
								value={option}
								checked={deviceType === option}
								onChange={e => setDeviceType(e.target.value)}
								required
							/>
							<label
								htmlFor={`device-${option.replace(/\s+/g, "-").toLowerCase()}`}
							>
								{option}
							</label>
						</div>
					))}
				</fieldset>

				<button type="submit">Rozpocznij Ankietę</button>
			</form>
		</div>
	);
}

export default ParticipantInfoForm;
