'''

TODO:
add_uri_to_local_database(uri) -> None
get_video_embedding_from_google(uri) -> embedding
add_embedding_to_chroma(embedding) -> None
get_text_embedding_from_google(text) -> embedding
find_closest_embedding_from_embedding(embedding) -> [uris, metadata]


'''

from typing import List
import vertexai
import chromadb
from vertexai.vision_models import MultiModalEmbeddingModel, Video, Image
from vertexai.vision_models import VideoSegmentConfig

class GCPHandler:
    def __init__(self) -> None:
        # Initialize Vertex AI with the project and location
        vertexai.init(project='spaceshtn', location="us-central1")
        self.model = MultiModalEmbeddingModel.from_pretrained("multimodalembedding")
    
    def get_embedding_from_video(self, blob_name: str):
        """Extracts embeddings from a video file."""
        embeddings = self.model.get_embeddings(
            video=Video.load_from_file(blob_name),
        )
        return embeddings.video_embeddings[0].embedding

    def get_embedding_from_text(self, string: str):
        """Extracts embeddings from a text string."""
        embeddings = self.model.get_embeddings(
            contextual_text=string,
        )
        return embeddings.text_embedding

    def get_embedding_from_image(self, blob_name: str):
        """Extracts embeddings from an image file."""
        # Load the image from the file using the appropriate method
        image = Image.load_from_file(blob_name)
        
        # Get the embeddings from the image
        embeddings = self.model.get_embeddings(image=image)
        
        # Return the first image embedding, assuming only one is extracted
        return embeddings.image_embedding

class ChromaHandler:
    def __init__(self) -> None:
        """Initialize the ChromaDB client and collection."""
        self.client = chromadb.PersistentClient("db")
        self.db = self.client.get_or_create_collection(name="embeddings")
    
    def upsert_embedding_to_db(self, embeddings: List[List[float]], metadatas: List[str], ids: List[str]) -> None:
        """Upserts embeddings into the ChromaDB collection."""
        if len(embeddings) != len(metadatas) or len(embeddings) != len(ids):
            raise ValueError("Length of embeddings, documents, and ids must be the same")
        
        self.db.upsert(
            embeddings=embeddings,
            metadatas=metadatas,
            ids=ids
        )

    def find_closest_embedding(self, query_embedding: List[float], n_results: int = 5) -> List[str]:
        """Finds the closest embeddings in the database to a query embedding."""
        results = self.db.query(
            query_embeddings=[query_embedding],
            n_results=n_results
        )
        return results  # return the documents associated with closest embeddings
    def query_all(self):
        return self.db.get(
            include=["metadatas"]
        )
# Example usage:
if __name__ == "__main__":
    # Initialize handlers
    gcp_handler = GCPHandler()
    chroma_handler = ChromaHandler()

    # Example: Get embeddings from a text
    text_embedding = gcp_handler.get_embedding_from_text("This is an example sentence.")
    print(text_embedding)
    # Example: Upsert the text embedding into ChromaDB
    chroma_handler.upsert_embedding_to_db(
        embeddings=[text_embedding],
        documents=["This is an example sentence."],
        ids=["example_id"]
    )
    
    # Example: Query for the closest embedding
    query_result = chroma_handler.find_closest_embedding(text_embedding)
    print("Closest embeddings:", query_result)
