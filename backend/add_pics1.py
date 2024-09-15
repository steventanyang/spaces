import requests
from google.cloud import storage
from typing import List, Tuple
import uuid
import os
from storage import GCPHandler, ChromaHandler
url = "http://localhost:8000/upload_video/"

from pathlib import Path

# Specify the directory
directory = Path('pics')
coords = ((43.4725617, -80.5399001, 3),
(43.4727432, -80.5397586, 3),
(43.4728347, -80.5396795, 2),
(43.4730877, -80.5395893, 1),
(43.4734254, -80.5402126, 1))

gcp_handler = GCPHandler()


# Google Cloud Storage bucket name
BUCKET_NAME = 'video-storage-12345678'

# Initialize the GCP storage client
import os
os.environ["GCLOUD_PROJECT"] = "spaceshtn"
storage_client = storage.Client()

def upload_to_gcs(file, blob_name: str) -> str:
    """Uploads a file to Google Cloud Storage and returns the public URL."""
    bucket = storage_client.bucket(BUCKET_NAME)
    blob = bucket.blob(blob_name)

    blob.upload_from_file(file)

    public_url = f"https://storage.googleapis.com/{BUCKET_NAME}/{blob_name}"
    return public_url

def upload_image(file, x: float, y: float, floor: int):
    """Endpoint to upload an image to Google Cloud Storage."""
    # Check if the uploaded file is in a valid image format
    # Generate a unique filename using uuid
    blob_name = f"images/{uuid.uuid4()}_{file.name}"

    # Upload the image file to GCS
    public_url = upload_to_gcs(file, blob_name)
    internal_url = f"gs://{BUCKET_NAME}/{blob_name}"

    # Get the embedding for the uploaded image
    image_embedding = gcp_handler.get_embedding_from_image(internal_url)

    # Save the embedding to ChromaDB (using blob_name as ID)
    chroma_handler = ChromaHandler()
    chroma_handler.upsert_embedding_to_db(
        embeddings=[image_embedding],
        ids=[public_url],
        metadatas=[{"x": x, "y": y, "floor": floor}],
    )

    return {"message": "Image uploaded successfully", "image_url": {public_url, internal_url}}

# Iterate over all jpg files recursively
for i in range(1, 6):
  for file in directory.rglob(f"{i}/*.jpg"):
      print(file.name)
      with open(file, "rb") as file:
          # Create the file object to be sent in the request
          upload_image(file, coords[i - 1][0], coords[i - 1][1], coords[i - 1][2])

