import orjson

from src.core.cache import redis_client


async def get(key: str) -> dict | None:
    try:
        cached = await redis_client.get(key)
        if cached:
            return orjson.loads(cached)
    except Exception:
        pass
    return None


async def set(key: str, value: dict, ttl_seconds: int) -> None:
    try:
        await redis_client.setex(key, ttl_seconds, orjson.dumps(value))
    except Exception:
        pass


async def delete(key: str) -> None:
    try:
        await redis_client.delete(key)
    except Exception:
        pass


async def delete_pattern(pattern: str) -> None:
    try:
        keys = await redis_client.keys(pattern)
        if keys:
            await redis_client.delete(*keys)
    except Exception:
        pass


async def invalidate_filter_options_cache() -> None:
    await delete_pattern("filter_options:*")


async def invalidate_last_year_cache() -> None:
    await delete("sales:last-year")


async def invalidate_user_cache(user_id: int) -> None:
    await delete(f"user:me:{user_id}")
