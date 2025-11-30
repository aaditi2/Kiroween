"""Encrypt a plaintext API key and optionally write an entry to `backend/.env`.

Usage examples:
  python scripts/encrypt_key.py --name ANTHROPIC_KEY --value sk-... --out backend/.env
  python scripts/encrypt_key.py --name ANTHROPIC_KEY --value-file secret.txt

The script will produce a Fernet token which you can store in `.env` as
`ANTHROPIC_KEY_ENC=<token>`. Store the master key securely (env var `MASTER_KEY`
or OS keyring). To generate a master key run `python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"`.
"""
from __future__ import annotations

import argparse
import os
import sys

from backend.app.core import crypto


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--name", required=True, help="Base name for env var (eg. ANTHROPIC_KEY)")
    group = p.add_mutually_exclusive_group(required=True)
    group.add_argument("--value", help="Plaintext key value")
    group.add_argument("--value-file", help="Read plaintext key from file")
    p.add_argument("--master-key", help="Master key to use for encryption (optional)")
    p.add_argument("--out", help="File to append the env entry to (eg. backend/.env)")

    args = p.parse_args()

    if args.value_file:
        with open(args.value_file, "r") as fh:
            value = fh.read().strip()
    else:
        value = args.value.strip()

    master = args.master_key or os.environ.get("MASTER_KEY")
    if not master:
        print("MASTER_KEY not provided. Generating a new one for you.")
        master = crypto.generate_master_key()
        print("Generated MASTER_KEY:\n", master)
        print("Store this value securely (env var MASTER_KEY or OS keyring).")

    token = crypto.encrypt(value, master)
    env_name = f"{args.name}_ENC"
    line = f"{env_name}={token}\n"

    print("Encrypted token (store this in your .env as below):")
    print(line)

    if args.out:
        with open(args.out, "a") as fh:
            fh.write(line)
        print(f"Appended encrypted key to {args.out}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())