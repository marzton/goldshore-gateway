#!/usr/bin/env python3
from __future__ import annotations

import fnmatch
import sys
from pathlib import Path


def extract_list(lines: list[str], section: str) -> list[str]:
    in_scope = False
    in_section = False
    items: list[str] = []

    for raw_line in lines:
        line = raw_line.rstrip("\n")
        stripped = line.strip()

        if not stripped or stripped.startswith("#"):
            continue

        if not in_scope:
            if stripped == "scope:":
                in_scope = True
            continue

        if in_section:
            if line.startswith("    - "):
                items.append(line.split("- ", 1)[1].strip())
                continue
            if line.startswith("  ") and not line.startswith("    "):
                break
            continue

        if line.startswith(f"  {section}:"):
            in_section = True

    return items


def matches(path: str, patterns: list[str]) -> bool:
    return any(fnmatch.fnmatch(path, pattern) for pattern in patterns)


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: validate_agent_scope.py <scope-file> [changed-path ...]", file=sys.stderr)
        return 2

    scope_file = Path(sys.argv[1])
    changed_paths = [p for p in sys.argv[2:] if p]

    if not scope_file.exists():
        print(f"::error file={scope_file}::Scope file not found")
        return 1

    lines = scope_file.read_text().splitlines(True)
    allowed = extract_list(lines, "allowed")
    forbidden = extract_list(lines, "forbidden")

    if not allowed:
        print(f"::error file={scope_file}::No allowed patterns found in scope file")
        return 1

    errors: list[str] = []
    for path in changed_paths:
        if matches(path, forbidden):
            errors.append(f"{path} matches forbidden patterns in {scope_file}")
            continue
        if not matches(path, allowed):
            errors.append(f"{path} is outside allowed patterns in {scope_file}")

    if errors:
        for error in errors:
            print(f"::error::{error}")
        return 1

    print(f"Validated {len(changed_paths)} path(s) against {scope_file}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
