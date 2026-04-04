import re
import os

path = ".next/dev/cache/turbopack/23c464985/00005671.sst"
try:
    with open(path, "rb") as f:
        data = f.read()

    # Find longest sequences of printable ascii including newlines
    # Since JS/TSX files have a lot of printable text
    text_chunks = re.findall(b'[ -~\\n\\r\\t]{500,}', data)
    
    # Filter and sort by length descending
    chunks = sorted([c.decode('utf-8', errors='ignore') for c in text_chunks], key=len, reverse=True)
    
    print(f"Found {len(chunks)} large text blocks in {path}")
    
    for i, c in enumerate(chunks[:5]):
        print(f"\n--- Chunk {i} (length {len(c)}) ---")
        print(c[:200]) # Print start
        print("... [TRUNCATED] ...")
        
        # Save to file
        with open(f"recovered_chunk_{i}.tsx", "w") as out:
            out.write(c)
        print(f"Saved chunk to recovered_chunk_{i}.tsx")

except Exception as e:
    print(f"Error reading {path}: {e}")
