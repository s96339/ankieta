// src/services/googleSheetsService.js
const SCRIPT_URL = `https://script.google.com/macros/s/AKfycbxrfxT9-kH4mPxoo--mv6wvqxz6MbAM_B_mcBnGXiaA9TuOBqILHQvRaMUYpRBiSmbI_w/exec`;
export const sendDataToGoogleSheet = async data => {
	if (!SCRIPT_URL || SCRIPT_URL === "TWOJ_URL_DO_GOOGLE_APPS_SCRIPT_WEB_APP") {
		console.error("URL do Google Apps Script nie jest skonfigurowany!");
		alert("Błąd konfiguracji: URL do zapisu danych nie jest ustawiony.");
		return { success: false, error: "Brak konfiguracji URL skryptu." };
	}

	try {
		// Tworzymy obiekt FormData. To często pomaga z CORS,
		// ponieważ przeglądarki traktują to inaczej niż surowy JSON.
		// Jednak GAS oczekuje JSON w e.postData.contents.
		// Spróbujmy najpierw bez FormData, tylko z usuniętym/zmienionym Content-Type.

		const response = await fetch(SCRIPT_URL, {
			method: "POST",
			mode: "cors", // Niezbędne dla żądań cross-origin
			cache: "no-cache",
			// OPCJA 1: Całkowicie usuń nagłówek 'Content-Type'
			// headers: {}, // Pusty obiekt headers lub całkowity brak tej linii

			// OPCJA 2: Spróbuj z 'text/plain'. GAS powinien to obsłużyć.
			headers: {
				"Content-Type": "text/plain;charset=UTF-8", // Lub po prostu 'text/plain'
			},
			body: JSON.stringify(data), // Nadal wysyłamy string JSON
		});

		// WAŻNE: Google Apps Script po udanym doPost często zwraca przekierowanie (302)
		// do strony potwierdzenia Google. Fetch domyślnie podąża za przekierowaniami.
		// Jeśli response.ok jest false, a status to np. 0 lub błąd sieciowy,
		// to problem CORS jest nadal aktywny.

		if (!response.ok) {
			// Logika obsługi błędów, jak poprzednio.
			// Ważne jest zobaczyć response.status i response.statusText
			let errorText = `Błąd HTTP! Status: ${response.status} (${response.statusText})`;
			try {
				const responseBodyText = await response.text(); // Spróbuj odczytać ciało odpowiedzi
				errorText += ` | Odpowiedź: ${responseBodyText.substring(0, 500)}`;
				console.error("Pełna odpowiedź błędu z serwera:", responseBodyText);
			} catch (e) {
				// ignore
			}
			console.error("Błąd wysyłania danych:", errorText);
			return { success: false, error: errorText };
		}

		// Jeśli GAS zwraca JSON (co zrobiliśmy w naszym skrypcie), to próbujemy go sparsować.
		// Jeśli GAS zwraca HTML (np. stronę błędu Google lub stronę potwierdzenia po przekierowaniu),
		// to response.json() rzuci błąd.
		try {
			const result = await response.json();
			console.log("Odpowiedź JSON z Google Apps Script:", result);
			return {
				success: result.status === "success",
				data: result.data,
				message: result.message,
			};
		} catch (jsonError) {
			// To może się zdarzyć, jeśli GAS zwrócił HTML zamiast JSON
			// np. po przekierowaniu, lub jeśli odpowiedź nie jest JSON-em.
			console.warn(
				"Odpowiedź z GAS nie była poprawnym JSON-em. Sprawdzanie statusu OK.",
				jsonError
			);
			// Jeśli doszło tutaj, a response.ok było true, możemy założyć sukces operacji po stronie GAS,
			// nawet jeśli nie dostaliśmy JSON-a zwrotnego.
			// Można też sprawdzić response.type === 'opaque' (dla no-cors, ale my używamy cors)
			// lub response.redirected
			console.log(
				"Odpowiedź (nie-JSON) z GAS, status:",
				response.status,
				"Przekierowano:",
				response.redirected
			);
			// Dla prostoty, jeśli response.ok jest true, uznajemy za sukces
			return {
				success: true,
				message: "Dane prawdopodobnie wysłane, ale odpowiedź nie była JSON.",
			};
		}
	} catch (error) {
		// To jest błąd sieciowy, zanim jeszcze dostaniemy odpowiedź HTTP
		console.error(
			"Błąd sieci lub wykonania fetch (np. problem CORS):",
			error.name,
			error.message,
			error
		);
		return {
			success: false,
			error:
				`${error.name}: ${error.message}` || "Nieznany błąd sieciowy / CORS.",
		};
	}
};
