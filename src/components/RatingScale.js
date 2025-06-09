import React from "react";
import { ratingLabels } from "../data/images"; // Importujemy etykiety

function RatingScale({ selectedValue, onChange, descState }) {
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
							style={{ gridTemplateRows: `${descState ? "1fr" : "0fr"}` }}
						>
							<div>{item.description}</div>
						</div>
					</label>
				</div>
			))}
		</div>
	);
}

export default RatingScale;
