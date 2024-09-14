import vertexai
import chromadb

from vertexai.vision_models import MultiModalEmbeddingModel, Video
from vertexai.vision_models import VideoSegmentConfig

# TODO(developer): Update project_id and location
vertexai.init(project='spaceshtn', location="northamerica-northeast1")

# model = MultiModalEmbeddingModel.from_pretrained("multimodalembedding")

# embeddings = model.get_embeddings(
#     video=Video.load_from_file(
#         "gs://cloud-samples-data/vertex-ai-vision/highway_vehicles.mp4"
#     ),
#     video_segment_config=VideoSegmentConfig(end_offset_sec=1),
#     contextual_text="Cars on Highway",
# )

# # Video Embeddings are segmented based on the video_segment_config.
# print("Video Embeddings:")
# for video_embedding in embeddings.video_embeddings:
#     print(
#         f"Video Segment: {video_embedding.start_offset_sec} - {video_embedding.end_offset_sec}"
#     )
#     print(f"Embedding: {video_embedding.embedding}")

# print(f"Text Embedding: {embeddings.text_embedding}")

chroma_client = chromadb.Client()
# switch `create_collection` to `get_or_create_collection` to avoid creating a new collection every time
collection = chroma_client.get_or_create_collection(name="my_collection")
# switch `add` to `upsert` to avoid adding the same documents every time
collection.upsert(
    documents=[
        "This is a document about pineapple",
        "This is a document about oranges"
    ],
    ids=["id1", "id2"]
)

# collection.upsert(
#     documents=["doc 3"],
#     embeddings=[embeddings.video_embeddings[0].embedding],
#     ids=["id3"]
# )

results = collection.query(
    query_texts=["This is a query document about florida"], # Chroma will embed this for you
    n_results=2 # how many results to return
)

results = collection.query(
    query_texts=["This is a query document about cars driving"], # Chroma will embed this for you
    n_results=2 # how many results to return
)
print(results)