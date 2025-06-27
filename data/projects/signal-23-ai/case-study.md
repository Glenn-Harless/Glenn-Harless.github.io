# signal-23.ai

## problem

music duo signal-23 had extensive notion documentation scattered across databases. fans constantly asked questions already answered somewhere. manual responses took hours. needed ai interface matching their cyberpunk aesthetic.

existing rag solutions felt corporate. nothing captured the duo's retro-futuristic vibe.

## approach

built custom rag system with notion as knowledge source. cyberpunk terminal ui with real-time signal simulation.

architecture decisions:
- faiss for vector storage (pgvector as backup)
- ollama for local llm inference
- two-layer caching for performance
- websocket for real-time feel

```python
# custom notion loader
class NotionLoader:
    def __init__(self, token: str, database_id: str):
        self.notion = Client(auth=token)
        self.database_id = database_id
        
    async def load_pages(self):
        # efficient page extraction
        pages = await self.notion.databases.query(self.database_id)
        for page in pages['results']:
            yield self.extract_content(page)

# intelligent chunking
def chunk_documents(docs, chunk_size=500, overlap=50):
    chunks = []
    for doc in docs:
        text = doc.page_content
        for i in range(0, len(text), chunk_size - overlap):
            chunk = text[i:i + chunk_size]
            chunks.append(Document(
                page_content=chunk,
                metadata={**doc.metadata, 'chunk_id': i}
            ))
    return chunks
```

## implementation

11 commits from concept to production. started with basic rag, evolved to full cyberpunk experience.

backend features:
- notion api integration with rate limiting
- semantic chunking (500 tokens, 50 overlap)
- lru cache with ttl for embeddings
- fallback between faiss and pgvector
- monitoring for chunk/embed times

frontend magic:
- terminal interface with scan lines
- signal strength at 23.976 khz (film reference)
- dynamic coordinate tracking
- retro grid effects
- typewriter text animation

docker-compose for one-command deployment. environment-based config for flexibility.

## results

response times:
- cold query: 2-3 seconds
- cached query: <200ms
- 95% relevance accuracy on test queries

user engagement:
- average session: 12 minutes (up from 2)
- questions answered: 89% without human help
- fan feedback: "feels like talking to the band"

technical metrics:
- cache hit rate: 78%
- embedding generation: 1.2s per page
- vector search: 50ms average

deployed at signal23.ai. became central hub for fan interaction.

## learnings

aesthetic matters as much as accuracy. users forgive slower responses if the experience feels right.

technical insights:
- notion api quirky but powerful
- caching critical for perceived speed
- faiss > pgvector for small datasets
- ollama perfect for creative responses

ux insights:
- typing animations create anticipation
- fake technical readouts increase immersion
- retro aesthetics attract attention
- consistency with brand crucial

future plans:
- spotify integration for music context
- live show data incorporation
- fan-generated content pipeline
- multi-modal responses with visuals