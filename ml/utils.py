import json
import re
import json
from deep_translator import GoogleTranslator

def translate_to_english(text: str) -> str:
    return GoogleTranslator(source='auto', target='en').translate(text)
    
def extract_json(text):
    json_pattern = re.search(r'```json\s*\n?([\s\S]*?)\n?```', text, re.DOTALL)
    if not json_pattern:
        json_pattern = re.search(r'\{[\s\S]*?\}', text, re.DOTALL)
    if not json_pattern:
        print("JSON-блок не найден!")
        return None

    json_str = json_pattern.group(1).strip()
    json_str = re.sub(r'[\x00-\x1F\x7F]', '', json_str)
    print("Извлечённый JSON:\n", json_str)  
    try:
        return json.loads(json_str)
    except json.JSONDecodeError as e:
        print("Ошибка декодирования JSON:", e)
        print("Попробуем исправить кавычки и повторить...")
        
        # Пробуем заменить одинарные кавычки на двойные
        json_str_fixed = json_str.replace("'", "\"")
        
        try:
            return json.loads(json_str_fixed)
        except json.JSONDecodeError as e:
            print("Ошибка после исправления кавычек:", e)
    
    return None

def convert_width_height_to_numbers(data):
    if isinstance(data, dict):
        for key, value in data.items():
            if key in ["width", "height"]:
                if isinstance(value, str) and value.endswith('%'):
                    try:
                        data[key] = float(value.strip('%'))
                    except ValueError:
                        pass
                elif isinstance(value, str) and value.replace('.', '', 1).isdigit():
                    data[key] = float(value) if '.' in value else int(value)
            elif isinstance(value, (dict, list)):
                convert_width_height_to_numbers(value)
    elif isinstance(data, list):
        for item in data:
            convert_width_height_to_numbers(item)
    return data


def process_json(data):
    for slide in data.get("slides", []):
        for element in slide.get("elements", []):
            if element.get("type") == "list" and isinstance(element.get("content"), list):
                element["content"] = "\n".join(element["content"])
    return data

def chunk_text(text, max_length=512):
    sentences = re.split(r'(?<=[.!?])\s+', text)
    chunks = []
    current_chunk = []
    current_length = 0
    
    for sentence in sentences:
        sentence_length = len(sentence.split())
        if current_length + sentence_length <= max_length:
            current_chunk.append(sentence)
            current_length += sentence_length
        else:
            if current_chunk:
                chunks.append(" ".join(current_chunk))
                current_chunk = [sentence]
                current_length = sentence_length
    
    if current_chunk:
        chunks.append(" ".join(current_chunk))    
    overlapped_chunks = []
    for i in range(len(chunks)):
        if i > 0:
            prev_sent = re.split(r'(?<=[.!?])\s+', chunks[i-1])[-1] 
            overlapped_chunks.append(prev_sent + " " + chunks[i])
        else:
            overlapped_chunks.append(chunks[i])
    
    return overlapped_chunks

