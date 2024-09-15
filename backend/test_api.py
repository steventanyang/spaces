import requests

# Define the API endpoint
url = "http://localhost:8000/search_from_query/"  # Replace with the actual URL if deployed on a server
url2 = "http://localhost:8000/upload_images/"
# Open the video file you want to upload
video_file_path = "vid.mp4"  # Replace with your actual video file path

# Coordinates tuple (latitude, longitude)
coords = (40.7128, 74.0060, 2)  # Example coordinates, replace with actual values
x = 40.7128
y = 74.0060
floor = 2
# Prepare the files and data to be sent in the request

# files = {
#     "file": (video_file_path, video_file, "video/mp4"),  # Adjust MIME type if the video is not mp4
# }
data = {
    "query_input": "earth",
    "x": x,
    "y": y,
    "floor": floor,
}

# Send the POST request
response = requests.post(url, params=data)#, params=data)
print("Request Method:", response.request.method)
print("Request URL:", response.request.url)
print("Request Headers:", response.request.headers)
print("Request Body:", response.request.body)

# Check the response
print(response.json())
