from fastapi import FastAPI, UploadFile, File, HTTPException
from google.cloud import storage
from typing import List, Tuple
import uuid
import os

from storage import GCPHandler, ChromaHandler

app = FastAPI()

# Initialize the GCP and ChromaDB handlers
gcp_handler = GCPHandler()
chroma_handler = ChromaHandler()

# Google Cloud Storage bucket name
BUCKET_NAME = 'video-storage-12345678'

# Initialize the GCP storage client
import os
os.environ["GCLOUD_PROJECT"] = "spaceshtn"
storage_client = storage.Client()
'''
user uploads a video
for the demo we do not need multiple users we can just
search through all the videos we have in our chroma db
when the users searches the query consists of search query,
location data (name of the pin on the map, floor, etc)

search(location_data, query) -> uses the videos uploaded to the database as well
returns the urls of the most similar videos (public url)

upload_video(file) -> returns the public url to the video

post_video(UploadFile, location_data)
calls upload_video then uses the url to call create_embeddings

'''
def upload_to_gcs(file: UploadFile, blob_name: str) -> str:
    """Uploads a file to Google Cloud Storage and returns the public URL."""
    bucket = storage_client.bucket(BUCKET_NAME)
    blob = bucket.blob(blob_name)

    blob.upload_from_file(file.file)

    public_url = f"https://storage.googleapis.com/{BUCKET_NAME}/{blob_name}"
    return public_url

@app.post("/upload_video/")
async def upload_video(file: UploadFile, x: float, y: float, floor: int):
    """Endpoint to upload a video to Google Cloud Storage."""
    if file.content_type not in ["video/mp4", "video/avi", "video/mov"]:
        raise HTTPException(status_code=400, detail="Invalid video format. Please upload mp4, avi, or mov.")

    # Generate a unique filename using uuid
    blob_name = f"videos/{uuid.uuid4()}_{file.filename}"

    # Upload the video file to GCS
    public_url = upload_to_gcs(file, blob_name)
    internal_url = f"gs://{BUCKET_NAME}/{blob_name}"

    # Get the embedding for the uploaded video
    video_embedding = gcp_handler.get_embedding_from_video(internal_url)

    # Save the embedding to ChromaDB (using blob_name as ID)
    chroma_handler.upsert_embedding_to_db(
        embeddings=[video_embedding],
        ids=[public_url],
        metadatas=[{"x" : x, "y" : y, "floor" : floor}],
    )

    return {"message": "Video uploaded successfully", "video_url": {public_url, internal_url}}

@app.post("/upload_image/")
async def upload_image(file: UploadFile, x: float, y: float, floor: int):
    """Endpoint to upload an image to Google Cloud Storage."""
    # Check if the uploaded file is in a valid image format
    if file.content_type not in ["image/jpeg", "image/png", "image/gif", "image/webp"]:
        raise HTTPException(status_code=400, detail="Invalid image format. Please upload jpeg, png, gif, or webp.")

    # Generate a unique filename using uuid
    blob_name = f"images/{uuid.uuid4()}_{file.filename}"

    # Upload the image file to GCS
    public_url = upload_to_gcs(file, blob_name)
    internal_url = f"gs://{BUCKET_NAME}/{blob_name}"

    # Get the embedding for the uploaded image
    image_embedding = gcp_handler.get_embedding_from_image(internal_url)

    # Save the embedding to ChromaDB (using blob_name as ID)
    chroma_handler.upsert_embedding_to_db(
        embeddings=[image_embedding],
        ids=[public_url],
        metadatas=[{"x": x, "y": y, "floor": floor}],
    )

    return {"message": "Image uploaded successfully", "image_url": {public_url, internal_url}}

@app.post("/search_from_query/")
async def search_from_query(query_input: str, x: float, y: float, floor: int, n_results: int = 6):
    """
    Endpoint to find the closest embeddings to a query.
    
    - `location_data`: set of coordinates and floor
    - `query_input`: the text string.
    - `n_results`: Number of closest results to return (default 5).
    """
    query_embedding = gcp_handler.get_embedding_from_text(query_input)


    # Find closest embeddings in the database
    closest_documents = chroma_handler.find_closest_embedding(query_embedding, n_results)

    return {"closest_embeddings": closest_documents}

@app.post("/get_all_images/")
async def get_all_images():
    """
    Endpoint to get all images in the database.
    """
    return chroma_handler.query_all()