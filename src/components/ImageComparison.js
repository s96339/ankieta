// src/components/ImageComparison.js
import React, { useState, useEffect, useRef } from "react";
import RatingScale from "./RatingScale";

/**
 * Funkcja pomocnicza do płynnego przewijania z niestandardową prędkością.
 * @param {number} y - docelowa pozycja Y na stronie
 * @param {number} duration - czas trwania animacji w milisekundach
 */
const customSmoothScrollTo = (y, duration) => {
	const startY = window.scrollY;
	const distance = y - startY - 5;
	let startTime = null;

	const animation = currentTime => {
		if (startTime === null) startTime = currentTime;
		const timeElapsed = currentTime - startTime;

		// Prosta funkcja "ease-in-out" dla płynniejszego ruchu
		const t = timeElapsed / (duration / 2);
		let newPos;
		if (t < 1) {
			newPos = (distance / 2) * t * t + startY;
		} else {
			const tMinus1 = t - 1;
			newPos = (-distance / 2) * (tMinus1 * (tMinus1 - 2) - 1) + startY;
		}

		window.scrollTo(0, newPos);
		if (timeElapsed < duration) {
			requestAnimationFrame(animation);
		}
	};

	requestAnimationFrame(animation);
};

function ImageComparison({
	imageSet,
	degradedImage,
	onNextComparison,
	isLastDegraded,
	isLastSet,
}) {
	const [currentRating, setCurrentRating] = useState(null);
	const [descVisible, setDescVisible] = useState(false);

	const evaluatedImageWrapperRef = useRef(null);

	useEffect(() => {
		setCurrentRating(null);

		if (evaluatedImageWrapperRef.current) {
			// Używamy getBoundingClientRect() dla precyzyjnego określenia pozycji
			const rect = evaluatedImageWrapperRef.current.getBoundingClientRect();

			// POPRAWIONY WARUNEK:
			// Przewijaj tylko wtedy, gdy górna krawędź elementu jest powyżej
			// górnej krawędzi widocznego okna (viewportu).
			if (rect.top < 0) {
				// Oblicz docelową pozycję scrolla.
				// rect.top to odległość od góry viewportu, więc musimy ją dodać
				// do obecnej pozycji scrolla, aby uzyskać absolutną pozycję elementu.
				const targetScrollY = window.scrollY + rect.top;

				// Używamy naszej niestandardowej funkcji przewijania z krótszym czasem
				customSmoothScrollTo(targetScrollY, 300); // 300ms to znacznie szybciej
			}
		}
	}, [degradedImage]);

	const handleRatingChange = value => {
		setCurrentRating(value);
	};

	const handleSubmitRating = () => {
		if (currentRating === null) {
			alert("Proszę wybrać ocenę.");
			return;
		}
		onNextComparison(imageSet.id, degradedImage.id, currentRating);
	};

	if (!imageSet || !degradedImage) {
		return <p>Ładowanie obrazów...</p>;
	}

	return (
		<div className="image-comparison-container">
			<h2>Porównanie obrazów</h2>
			<div className="images-display">
				<div className="image-wrapper">
					<h3>Obraz referencyjny</h3>
					<img
						src={process.env.PUBLIC_URL + "/" + imageSet.original}
						alt="Oryginał"
					/>
				</div>
				<div className="image-wrapper" ref={evaluatedImageWrapperRef}>
					<h3>Obraz oceniany</h3>
					<img
						src={process.env.PUBLIC_URL + "/" + degradedImage.src}
						alt={degradedImage.id}
					/>
				</div>
			</div>
			<RatingScale
				selectedValue={currentRating}
				onChange={handleRatingChange}
				descState={descVisible}
			/>
			<div className="buttonFlex">
				<button
					onClick={() => setDescVisible(prev => !prev)}
					style={{
						color: "#333",
						backgroundColor: "#dddde7",
						border: "1px solid #bbb",
					}}
				>
					{descVisible ? "Wyłącz" : "Włącz"} opisy 💬
				</button>
				<button onClick={handleSubmitRating} disabled={currentRating === null}>
					{isLastDegraded && isLastSet
						? "Zakończ i wyślij ostatnią ocenę"
						: "Następne porównanie"}
				</button>
			</div>
		</div>
	);
}

export default ImageComparison;
