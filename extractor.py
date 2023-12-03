import json

def extract_fields(input_file, output_file, fields):
    with open(input_file, 'r') as file:
        data = json.load(file)

    extracted_data = [{field: entry[field] for field in fields} for entry in data]

    with open(output_file, 'w') as file:
        json.dump(extracted_data, file, indent=2)

if __name__ == "__main__":
    input_file = input("Enter the path to the input JSON file: ")
    output_file = input("Enter the path for the output JSON file: ")

    fields = []
    while True:
        field = input("Enter a field to extract (or enter 'done' to finish): ")
        if field.lower() == 'done':
            break
        fields.append(field)

    extract_fields(input_file, output_file, fields)

    print(f"Data extracted for fields {', '.join(fields)} and saved to {output_file}.")
