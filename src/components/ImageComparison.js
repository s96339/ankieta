import React, { useState, useEffect } from "react";
import RatingScale from "./RatingScale"; // Assuming RatingScale is in the same directory

function ImageComparison({
	imageSet,
	degradedImage,
	onNextComparison,
	isLastDegraded,
	isLastSet,
}) {
	const [currentRating, setCurrentRating] = useState(null);
	const [descVisible, setDescVisible] = useState(false);

	useEffect(() => {
		setCurrentRating(null);
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
				<div className="image-wrapper">
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
				descChange={setDescVisible}
				descState={descVisible}
			/>
			<button
				onClick={handleSubmitRating}
				disabled={
					currentRating ===
					null /* || isLoading - można usunąć, jeśli isLoading nie jest już tu relevantne */
				}
			>
				{isLastDegraded && isLastSet
					? "Zakończ i wyślij ostatnią ocenę"
					: "Następne porównanie"}
			</button>
		</div>
	);
}

export default ImageComparison;
