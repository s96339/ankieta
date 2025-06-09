import React from "react";
import { ratingLabels } from "../data/images"; // Importujemy etykiety

function RatingScale({ selectedValue, onChange, descChange, descState }) {
	return (
		<div className="rating-scale">
			<p>Oceń jakość obrazu w porównaniu do obrazu referencyjnego:</p>
			{ratingLabels.map(item => (
				<div key={item.value}>
					<input
						type="radio"
						id={`rating-${item.value}`}
						name="qualityRating"
						value={item.value}
						checked={selectedValue === item.value}
						onChange={() => onChange(item.value)}
						required
					/>
					<label htmlFor={`rating-${item.value}`}>
						{item.label}
						<div
							className="ratingDesc"
							style={{ gridTemplateRows: `${descState ? "0fr" : "0fr"}` }}
						>
							<div>{item.description}</div>
						</div>
					</label>
				</div>
			))}
			<button
				onClick={() => descChange(prev => !prev)}
				style={{
					fontSize: "smaller",
					color: "#333",
					backgroundColor: "#dddde7",
					border: "1px solid #bbb",
				}}
			>
				{descState ? "Włącz" : "Wyłacz"} opisy 💬
			</button>
		</div>
	);
}

export default RatingScale;
