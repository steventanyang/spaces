from fastapi import FastAPI, UploadFile, File, HTTPException
from google.cloud import storage
from typing import List
import uuid
import os

from storage import GCPHandler, ChromaHandler

app = FastAPI()

# Initialize the GCP and ChromaDB handlers
gcp_handler = GCPHandler()
chroma_handler = ChromaHandler()

# Google Cloud Storage bucket name
BUCKET_NAME = 'your-gcp-bucket-name'

# Initialize the GCP storage client
storage_client = storage.Client()

def upload_to_gcs(file: UploadFile, blob_name: str) -> str:
    """Uploads a file to Google Cloud Storage and returns the public URL."""
    bucket = storage_client.bucket(BUCKET_NAME)
    blob = bucket.blob(blob_name)

    blob.upload_from_file(file.file)

    blob.make_public()
    return blob.public_url

@app.post("/upload_video/")
async def upload_video(file: UploadFile = File(...)):
    """Endpoint to upload a video to Google Cloud Storage."""
    if file.content_type not in ["video/mp4", "video/avi", "video/mov"]:
        raise HTTPException(status_code=400, detail="Invalid video format. Please upload mp4, avi, or mov.")

    # Generate a unique filename using uuid
    blob_name = f"videos/{uuid.uuid4()}_{file.filename}"

    # Upload the video file to GCS
    public_url = upload_to_gcs(file, blob_name)

    # Get the embedding for the uploaded video
    video_embedding = gcp_handler.get_embedding_from_video(public_url)

    # Save the embedding to ChromaDB (using blob_name as ID)
    chroma_handler.upsert_embedding_to_db(
        embeddings=[video_embedding],
        documents=[public_url],
        ids=[blob_name]
    )

    return {"message": "Video uploaded successfully", "video_url": public_url}

@app.post("/find_closest_embedding/")
async def find_closest_embedding(query_type: str, query_input: str, n_results: int = 5):
    """
    Endpoint to find the closest embeddings to a query.
    
    - `query_type`: Can be 'text' or 'video_uri'.
    - `query_input`: Either the text string or the GCP URI of a video.
    - `n_results`: Number of closest results to return (default 5).
    """
    if query_type == "text":
        # Extract embedding from text
        query_embedding = gcp_handler.get_embedding_from_text(query_input)
    elif query_type == "video_uri":
        # Extract embedding from video URI
        query_embedding = gcp_handler.get_embedding_from_video(query_input)
    else:
        raise HTTPException(status_code=400, detail="Invalid query type. Use 'text' or 'video_uri'.")

    # Find closest embeddings in the database
    closest_documents = chroma_handler.find_closest_embedding(query_embedding, n_results)

    return {"closest_embeddings": closest_documents}

