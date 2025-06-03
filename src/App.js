// src/App.js
import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import ParticipantInfoForm from "./components/ParticipantInfoForm";
import ImageComparison from "./components/ImageComparison";
import ThankYouPage from "./components/ThankYouPage";
import { imageSets } from "./data/images"; // Upewnij się, że ta ścieżka jest poprawna
import { sendDataToGoogleSheet } from "./services/googleSheetsService";

const STAGES = {
	INFO: "info",
	SURVEY: "survey",
	THANKS: "thanks",
};

function App() {
	const [currentStage, setCurrentStage] = useState(STAGES.INFO);
	// participantInfo będzie teraz zawierać również surveyTimestamp
	const [participantInfo, setParticipantInfo] = useState(null);

	const [currentImageSetIndex, setCurrentImageSetIndex] = useState(0);
	const [currentDegradedImageIndex, setCurrentDegradedImageIndex] = useState(0);
	const [isLoading, setIsLoading] = useState(false);

	const submissionPromisesRef = useRef([]);

	useEffect(() => {
		if (currentStage === STAGES.INFO) {
			setParticipantInfo(null);
			setCurrentImageSetIndex(0);
			setCurrentDegradedImageIndex(0);
			submissionPromisesRef.current = [];
			setIsLoading(false);
		}
	}, [currentStage]);

	const handleParticipantInfoSubmit = info => {
		// info to { age, gender, deviceType }
		const surveySessionTimestamp = new Date().toISOString();
		setParticipantInfo({
			...info,
			surveyTimestamp: surveySessionTimestamp, // Dodajemy timestamp sesji
		});
		setCurrentStage(STAGES.SURVEY);
	};

	const sendSingleRatingAsync = async ratingData => {
		console.log(
			"Rozpoczynanie wysyłania pojedynczej oceny (w tle):",
			ratingData
		);

		// Payload zawiera teraz surveyTimestamp z participantInfo, a ratingData jest zredukowane
		const payload = {
			// Dane uczestnika i timestamp sesji:
			age: participantInfo.age,
			gender: participantInfo.gender,
			deviceType: participantInfo.deviceType,
			surveyTimestamp: participantInfo.surveyTimestamp,
			// Dane konkretnej oceny (już bez originalImageId, degradationType, timestamp):
			...ratingData, // Powinno zawierać degradedImageId, rating
		};

		try {
			const result = await sendDataToGoogleSheet(payload);
			if (!result.success) {
				alert(
					`Wystąpił błąd podczas wysyłania danych oceny dla ${
						ratingData.degradedImageId // degradedImageId jest w ratingData
					}: ${result.error || result.message}` +
						"\nTa ocena mogła nie zostać zapisana."
				);
				console.error("Błąd wysyłania pojedynczej oceny (w tle):", result);
				return Promise.reject(result.error || result.message);
			} else {
				console.log("Pojedyncza ocena wysłana pomyślnie (w tle).");
				return Promise.resolve();
			}
		} catch (error) {
			console.error("Krytyczny błąd podczas wysyłania:", error);
			alert(`Krytyczny błąd wysyłania dla ${ratingData.degradedImageId}.`);
			return Promise.reject(error);
		}
	};

	const handleNextComparison = async (originalId, degradedId, rating) => {
		// originalId jest nadal dostępne z komponentu ImageComparison, ale go nie wysyłamy
		// degradationType również nie jest już potrzebne do wysłania

		const ratingDetails = {
			// Nie dodajemy tu timestamp, originalImageId, ani degradationType
			degradedImageId: degradedId,
			rating: rating,
		};

		submissionPromisesRef.current.push(sendSingleRatingAsync(ratingDetails));

		const currentSet = imageSets[currentImageSetIndex];
		const isLastDegradedInSet =
			currentDegradedImageIndex >= currentSet.degraded.length - 1;
		const isLastSetInSurvey = currentImageSetIndex >= imageSets.length - 1;

		if (isLastDegradedInSet && isLastSetInSurvey) {
			setIsLoading(true);
			console.log(
				"Ostatnia ocena, przetwarzanie wszystkich zgromadzonych wysyłek..."
			);
			try {
				const results = await Promise.allSettled(submissionPromisesRef.current);
				console.log("Wyniki wszystkich wysyłek:", results);
				results.forEach(result => {
					if (result.status === "rejected") {
						console.warn(
							"Jedna z wysyłek w tle nie powiodła się ostatecznie:",
							result.reason
						);
					}
				});
			} catch (error) {
				console.error(
					"Wystąpił błąd podczas oczekiwania na wysłanie wszystkich ocen:",
					error
				);
				alert(
					"Wystąpił problem podczas finalizowania wysyłania danych. Niektóre dane mogły nie zostać zapisane."
				);
			} finally {
				setIsLoading(false);
				submissionPromisesRef.current = [];
				setCurrentStage(STAGES.THANKS);
			}
		} else {
			if (isLastDegradedInSet) {
				setCurrentImageSetIndex(prev => prev + 1);
				setCurrentDegradedImageIndex(0);
			} else {
				setCurrentDegradedImageIndex(prev => prev + 1);
			}
		}
	};

	const handleRestartSurvey = () => {
		setCurrentStage(STAGES.INFO);
	};

	const renderCurrentStage = () => {
		if (isLoading) {
			return <p>Przetwarzanie danych, proszę czekać...</p>;
		}

		switch (currentStage) {
			case STAGES.INFO:
				return <ParticipantInfoForm onSubmit={handleParticipantInfoSubmit} />;
			case STAGES.SURVEY:
				if (!participantInfo || !participantInfo.surveyTimestamp) {
					// Sprawdzamy też surveyTimestamp
					return (
						<p>
							Błąd: Informacje o uczestniku nie zostały poprawnie załadowane.
							Proszę wrócić do początku.
						</p>
					);
				}
				if (!imageSets || imageSets.length === 0)
					return <p>Brak zdefiniowanych obrazów do ankiety.</p>;

				if (currentImageSetIndex >= imageSets.length) {
					console.error("currentImageSetIndex out of bounds");
					setCurrentStage(STAGES.THANKS);
					return <p>Zakończono wszystkie zestawy obrazów.</p>;
				}
				const currentSet = imageSets[currentImageSetIndex];
				if (currentDegradedImageIndex >= currentSet.degraded.length) {
					console.error("currentDegradedImageIndex out of bounds");
					if (currentImageSetIndex < imageSets.length - 1) {
						setCurrentImageSetIndex(prev => prev + 1);
						setCurrentDegradedImageIndex(0);
					} else {
						setCurrentStage(STAGES.THANKS);
					}
					return <p>Ładowanie następnego obrazu...</p>;
				}
				const currentDegraded = currentSet.degraded[currentDegradedImageIndex];

				const isLastDegradedImage =
					currentDegradedImageIndex === currentSet.degraded.length - 1;
				const isLastImageSet = currentImageSetIndex === imageSets.length - 1;

				return (
					<ImageComparison
						imageSet={currentSet} // originalId jest nadal potrzebne do wyświetlenia obrazu oryginalnego
						degradedImage={currentDegraded} // degradedId i src są potrzebne do wyświetlenia i wysłania
						onNextComparison={handleNextComparison}
						isLastDegraded={isLastDegradedImage}
						isLastSet={isLastImageSet}
						isLoading={false}
					/>
				);
			case STAGES.THANKS:
				return <ThankYouPage onRestart={handleRestartSurvey} />;
			default:
				return <p>Nieznany etap.</p>;
		}
	};

	return (
		<div className="App">
			<header className="App-header">
				<h1>Ankieta Jakości Obrazów</h1>
			</header>
			<main>{renderCurrentStage()}</main>
			<footer>
				<p>Bartosz Sowiński</p>
				<p>
					Inżynierskie Zastosowania Informatyki w Elektrotechnice II stopień
				</p>
				<p>Politechnika Lubelska</p>
			</footer>
		</div>
	);
}

export default App;
