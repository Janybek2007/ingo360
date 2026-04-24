from typing import Any

from src.utils.deduplicate_skipped_records import deduplicate_skipped_records


def save_import_stats(import_log: Any, result: dict[str, Any]) -> None:
    import_log.records_count = result["total"]
    import_log.imported_count = result["imported"]
    import_log.inserted_count = result.get("inserted", 0)
    import_log.updated_count = result.get("updated", 0)
    import_log.skipped_count = result["skipped"]
    import_log.deduplicated_count = result.get("deduplicated", 0)


def build_import_result(
    *,
    total: int,
    imported: int,
    skipped_records: list[dict[str, Any]],
    skipped_total: int | None = None,
    inserted: int = 0,
    updated: int = 0,
    deduplicated: int = 0,
    **extra: Any,
) -> dict[str, Any]:
    unique_skipped_records = deduplicate_skipped_records(skipped_records)
    skipped_count = (
        skipped_total if skipped_total is not None else len(unique_skipped_records)
    )
    result = {
        "total": total,
        "imported": imported,
        "skipped": skipped_count,
        "inserted": inserted,
        "updated": updated,
        "deduplicated": deduplicated,
        "skipped_records": unique_skipped_records,
    }
    result.update(extra)
    return result
