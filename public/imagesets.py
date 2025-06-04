import os
import json

# --- Konfiguracja ---
# Ścieżki do folderów z obrazami (względem miejsca uruchomienia skryptu Pythona)
ORIGINALS_DIR = 'images/originals'
DEGRADED_DIR = 'images/degraded'

# Bazowe ścieżki URL, pod którymi obrazy będą dostępne na serwerze WWW
# Upewnij się, że są one zgodne z rzeczywistą strukturą katalogów w Twojej aplikacji React (np. w katalogu 'public/')
BASE_URL_ORIGINALS = 'images/originals/'
BASE_URL_DEGRADED = 'images/degraded/'

# Plik wyjściowy JavaScript
OUTPUT_JS_FILE = 'imageSets.js'

# Dopuszczalne rozszerzenia plików obrazów
IMAGE_EXTENSIONS = ('.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.jp2')

# --- Funkcje pomocnicze ---

def get_files_in_dir(directory):
    """Zwraca listę wszystkich plików w danym katalogu."""
    files = []
    if os.path.exists(directory) and os.path.isdir(directory):
        for f in os.listdir(directory):
            if os.path.isfile(os.path.join(directory, f)):
                files.append(f)
    else:
        print(f"Ostrzeżenie: Katalog {directory} nie istnieje lub nie jest katalogiem.")
    return files

def generate_image_sets_data():
    """Generuje listę danych obrazów do eksportu."""
    image_sets = []

    original_files = get_files_in_dir(ORIGINALS_DIR)
    degraded_files = get_files_in_dir(DEGRADED_DIR)

    for original_filename in original_files:
        # Pomiń pliki bez dopuszczalnego rozszerzenia obrazu
        if not original_filename.lower().endswith(IMAGE_EXTENSIONS):
            continue

        # Pobierz ID (nazwę pliku bez rozszerzenia)
        original_id = os.path.splitext(original_filename)[0]

        original_path_url = f"{BASE_URL_ORIGINALS}{original_filename}"

        current_degraded = []
        for degraded_filename in degraded_files:
            # Sprawdź, czy zdegradowany plik zaczyna się od ID oryginału
            if degraded_filename.startswith(original_id):
                degraded_path_url = f"{BASE_URL_DEGRADED}{degraded_filename}"
                current_degraded.append({
                    "id": degraded_filename, # ID to pełna nazwa pliku zdegradowanego
                    "src": degraded_path_url,
                    # Możesz dodać tutaj inne właściwości, jeśli Twoje zdegradowane obrazy je mają
                    # np. "degradationType": "Bitrate 300kbps" - to musiałbyś parsować z nazwy pliku
                    # lub mieć osobną konfigurację
                })
        
        # Sortuj zdegradowane obrazy po nazwie pliku, aby zachować porządek
        current_degraded.sort(key=lambda x: x['id'])

        image_sets.append({
            "id": original_id,
            "original": original_path_url,
            "degraded": current_degraded,
        })
    
    # Sortuj oryginalne zestawy po ID, aby zachować spójność
    image_sets.sort(key=lambda x: x['id'])

    return image_sets


def format_js_object(obj, indent_level=1):
    """
    Formatuje obiekt Pythona jako string JavaScript bez cudzysłowów dla kluczy.
    """
    indent_space = "    " * indent_level
    lines = []
    for k, v in obj.items():
        if isinstance(v, dict):
            value_str = format_js_object(v, indent_level + 1)
        elif isinstance(v, list):
            list_items = []
            for item in v:
                if isinstance(item, dict):
                    list_items.append(format_js_object(item, indent_level + 2))
                else:
                    list_items.append(json.dumps(item)) # Dla prostych wartości w listach
            value_str = f"[\n{indent_space}    " + f",\n{indent_space}    ".join(list_items) + f"\n{indent_space}]"
        else:
            value_str = json.dumps(v) # Użyj json.dumps dla wartości, aby obsłużyć stringi, liczby, bool itp.
        
        # Usuń cudzysłowy z klucza, jeśli jest to prawidłowy identyfikator JS
        # Zakładamy, że wszystkie klucze są prawidłowe identyfikatory (np. 'id', 'original', 'degraded', 'src', 'value', 'label')
        key_str = k 
        
        lines.append(f"{indent_space}{key_str}: {value_str}")
    return "{\n" + ",\n".join(lines) + f"\n{indent_space[:4]}}}" # Zmniejsz wcięcie zamykającej klamry o jeden poziom

def write_js_file(image_sets_data):
    """Zapisuje dane do pliku JavaScript z kluczami bez cudzysłowów."""
    js_content = "export const imageSets = [\n"
    
    for i, item in enumerate(image_sets_data):
        # Użyj nowej funkcji formatującej
        js_content += format_js_object(item)
        if i < len(image_sets_data) - 1:
            js_content += ",\n"
        js_content += "\n" # Dodaj nową linię po każdym obiekcie zestawu
    js_content += "];\n\n"

    # Dodaj statyczną tablicę ratingLabels (może pozostać w formacie JSON, bo to proste klucze i wartości)
    # Możesz też ręcznie sformatować ratingLabels, jeśli chcesz, aby również klucze tam były bez cudzysłowów
    # Poniżej używam json.dumps dla ratingLabels, bo jest prostszy
    js_content += """export const ratingLabels = [
    { value: 1, label: "W większości nieczytelny" },
    { value: 2, label: "Częściowo nieczytelny" },
    { value: 3, label: "Zauważalne zniekształcenia" },
    { value: 4, label: "Mało widoczne zniekształcenia" },
    { value: 5, label: "Brak widocznych zniekształceń" },
];
"""

    with open(OUTPUT_JS_FILE, 'w', encoding='utf-8') as f:
        f.write(js_content)
    print(f"Pomyślnie wygenerowano plik '{OUTPUT_JS_FILE}'")

# --- Główna część skryptu ---
if __name__ == "__main__":
    generated_data = generate_image_sets_data()
    write_js_file(generated_data)