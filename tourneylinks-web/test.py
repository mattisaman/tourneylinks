import re

with open("src/app/host/page.tsx", "r") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "const render" in line or "export default function" in line:
        print(f"Line {i+1}: {line.strip()}")
