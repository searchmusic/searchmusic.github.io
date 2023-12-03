base_file = "data.json"

import json

def update_artwork_url(json_file):
    try:
        with open(json_file, 'r') as file:
            data = json.load(file)

        while True:
            album_name_to_edit = input("Please provide the albumName you wish to edit data for (type 'done' to finish): ")

            if album_name_to_edit.lower() == 'done':
                break

            user_input = input(f"Enter a new string for 'artworkUrl' for albumName '{album_name_to_edit}': ")

            for item in data:
                if 'albumName' in item and item['albumName'] == album_name_to_edit:
                    item['artworkUrl'] = user_input

            with open(json_file, 'w') as file:
                json.dump(data, file, indent=2)

            print(f"Artwork URLs updated for albumName '{album_name_to_edit}'")

    except FileNotFoundError:
        print(f"File '{json_file}' not found.")
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")

if __name__ == "__main__":
    json_file_path = base_file
    update_artwork_url(json_file_path)
