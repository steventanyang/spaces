import vertexai

from vertexai.vision_models import MultiModalEmbeddingModel, Video
from vertexai.vision_models import VideoSegmentConfig

# TODO(developer): Update project_id and location
vertexai.init(project='spaceshtn', location="us-central1")

model = MultiModalEmbeddingModel.from_pretrained("multimodalembedding")

embeddings = model.get_embeddings(
    video=Video.load_from_file(
        "gs://cloud-samples-data/vertex-ai-vision/highway_vehicles.mp4"
    ),
    video_segment_config=VideoSegmentConfig(end_offset_sec=1),
    contextual_text="Cars on Highway",
)

# Video Embeddings are segmented based on the video_segment_config.
print("Video Embeddings:")
for video_embedding in embeddings.video_embeddings:
    print(
        f"Video Segment: {video_embedding.start_offset_sec} - {video_embedding.end_offset_sec}"
    )
    print(f"Embedding: {video_embedding.embedding}")

print(f"Text Embedding: {embeddings.text_embedding}")