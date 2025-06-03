import React from "react";

function ThankYouPage({ onRestart }) {
	return (
		<div className="thank-you-container">
			<h2>Dziękujemy za udział w ankiecie!</h2>
			<p>Twoje odpowiedzi zostały zapisane.</p>
			<button onClick={onRestart}>Wypełnij ankietę ponownie</button>
		</div>
	);
}

export default ThankYouPage;
