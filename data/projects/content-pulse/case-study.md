# content pulse

## problem

crypto moves fast. by the time you read about a trend, it's over. social media noise drowns signal. news sites bury the lede. traders needed real-time intelligence, not yesterday's news.

existing tools either too slow (manual curation) or too noisy (raw feeds). nothing connected the dots across platforms.

## approach

llm-powered aggregation with intelligent filtering. start narrow (crypto), expand systematically.

design principles:
- speed over perfection
- summaries over full text
- patterns over individual posts
- local llm for privacy

```python
# async scraping pipeline
async def scrape_sources():
    tasks = []
    for source in SOURCES:
        task = asyncio.create_task(scrape_source(source))
        tasks.append(task)
    
    results = await asyncio.gather(*tasks, return_exceptions=True)
    return [r for r in results if not isinstance(r, Exception)]

# llm summarization
async def summarize_article(content: str, model="llama3.2"):
    prompt = f"""
    Extract key insights from this crypto article:
    - Main thesis (1 sentence)
    - Market implications
    - Mentioned tokens/projects
    - Sentiment (bullish/bearish/neutral)
    
    Article: {content[:2000]}
    """
    
    response = await ollama.generate(model=model, prompt=prompt)
    return parse_structured_response(response)
```

## implementation

7 commits to mvp. focused on speed to market.

scraping layer:
- async beautifulsoup for parallel extraction
- rate limiting to avoid blocks
- fallback strategies for failed requests
- content validation pipeline

analysis engine:
- llama 3.2 for fast inference
- structured prompts for consistency
- in-memory caching for speed
- natural language query interface

frontend:
- bootstrap for rapid development
- real-time updates via polling
- responsive design for mobile traders
- dark mode by default

docker-compose packaging for one-click deploy. minimal dependencies for reliability.

## results

launch metrics:
- 10k+ articles processed daily
- 2-4 hour lead on mainstream coverage
- <500ms query response time
- 89% accuracy on sentiment analysis

early findings:
- vcs telegraph moves via portfolio posts
- discord activity predicts price action
- news sentiment lags actual trading
- cross-platform patterns strongest signals

user feedback:
- "caught the sui pump 3 hours early"
- "finally cutting through the noise"
- "like having 100 analysts"

currently expanding to:
- reddit integration (wallstreetbets, cryptocurrency)
- twitter firehose filtering
- traditional finance sources
- geopolitical event tracking

## learnings

start simple, iterate fast. perfect is the enemy of shipped.

technical insights:
- async everything for web scraping
- local llms surprisingly capable
- structured prompts > complex prompting
- in-memory often sufficient for mvps

product insights:
- traders want signals, not data
- speed matters more than depth
- ui simplicity crucial under stress
- trust builds through transparency

scaling challenges:
- rate limits everywhere
- content quality varies wildly
- llm consistency at scale
- storage for historical analysis

next phase: building historical dataset for backtesting signal quality. adding websocket for true real-time updates. exploring multi-modal analysis for chart patterns.