from __future__ import annotations

import os
from typing import Optional

try:
    from cryptography.fernet import Fernet
except Exception as e:  # pragma: no cover - handled at runtime
    raise RuntimeError(
        "cryptography is required for key encryption. Install with `pip install cryptography`."
    )

try:
    import keyring
except Exception:  # keyring is optional; we'll only use if available
    keyring = None


def generate_master_key() -> str:
    """Generate a URL-safe base64 key for Fernet.

    Store this key in `MASTER_KEY` env var or in OS keyring under service
    name `LogicHinter` and username `MASTER_KEY`.
    """
    return Fernet.generate_key().decode()


def encrypt(plaintext: str, master_key: str) -> str:
    f = Fernet(master_key.encode())
    token = f.encrypt(plaintext.encode())
    return token.decode()


def decrypt(token: str, master_key: str) -> str:
    f = Fernet(master_key.encode())
    return f.decrypt(token.encode()).decode()


def get_master_key() -> str:
    """Retrieve the master key from environment or OS keyring.

    Raises RuntimeError with guidance if not found.
    """
    mk = os.environ.get("MASTER_KEY")
    if mk:
        return mk

    if keyring is not None:
        stored = keyring.get_password("LogicHinter", "MASTER_KEY")
        if stored:
            return stored

    raise RuntimeError(
        "MASTER_KEY not found. Set env var MASTER_KEY or store it in the OS keyring. "
        "You can generate one with: `from cryptography.fernet import Fernet; Fernet.generate_key().decode()`"
    )


def store_master_key_in_keyring(master_key: str) -> None:
    if keyring is None:
        raise RuntimeError("`keyring` package is not available; install it to use OS keyring storage")
    keyring.set_password("LogicHinter", "MASTER_KEY", master_key)