import re

with open(".next/dev/cache/turbopack/23c464985/00005671.sst", "rb") as f:
    data = f.read()

# The SST file contains compiled or original source code.
# Let's search for "export default function HostLiveCampaignBuilder() {"
# and extract a large window around it.
idx = data.find(b"export default function HostLiveCampaignBuilder")
if idx != -1:
    start = max(0, idx - 500)
    end = min(len(data), idx + 200000)
    chunk = data[start:end].decode('utf-8', 'ignore')
    
    # Try to extract the whole file if it has import React
    import_idx = chunk.rfind("import React")
    if import_idx != -1:
        chunk = chunk[import_idx:]
        
    with open("recovered_host_page.tsx", "w") as out:
        out.write(chunk)
    print("Recovered from SST!")
else:
    print("Not found in SST.")
