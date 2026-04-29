import redis.asyncio as redis

from src.core.settings import settings

redis_client: redis.Redis = redis.from_url(settings.REDIS_URL, decode_responses=False)
