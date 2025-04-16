import csv
import json

def csv_to_json(csv_filename, json_filename):
    data = []
    
    # Open the CSV file using utf-8 encoding
    with open(csv_filename, encoding='utf-8') as csvfile:
        # Create a DictReader, which uses the first line as header
        csvreader = csv.DictReader(csvfile)
        
        # Iterate over each row in the CSV file
        for row in csvreader:
            # Create a new dictionary with the required keys
            item = {
                "emoji": row["Emoji"],
                "en": row["English"],
                "es": row["Spanish"],
                "fr": row["French"],
                "de": row["German"],
                "it": row["Italian"]
            }
            data.append(item)
    
    # Write the list of dictionaries to a JSON file with pretty printing
    with open(json_filename, 'w', encoding='utf-8') as jsonfile:
        json.dump(data, jsonfile, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    # Specify input and output file names as strings
    input_file = "emojismultiidioma.csv"
    output_file = "emojis.json"
    
    csv_to_json(input_file, output_file)
