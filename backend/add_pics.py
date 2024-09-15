import requests

url = "http://localhost:8000/upload_video/"

from pathlib import Path

# Specify the directory
directory = Path('pics')
coords = ((43.4725617, -80.5399001, 3),
(43.4727432, -80.5397586, 3),
(43.4728347, -80.5396795, 2),
(43.4730877, -80.5395893, 1),
(43.4734254, -80.5402126, 1))

# Iterate over all jpg files recursively
for file in directory.rglob('1/*.jpg'):
    filename = file.name
    files = {
            'file': (file.name, file.read_bytes(), 'image/jpeg')
        }
    with open(file, "rb") as file:
        # Create the file object to be sent in the request
        data = {
            'x': coords[0][0],
            'y': coords[0][1],
            'floor': coords[0][2]
        }
        print(data)
        
        # Send a POST request to the API
        response = requests.post(url, files=files, data=data)

