import re
import os

with open("all_turbopack_strings.txt", "r", encoding="utf-8", errors="ignore") as f:
    data = f.read()

def extract_chunks(keyword, output_file):
    print(f"Extracting for {keyword}...")
    matches = [m.start() for m in re.finditer(keyword, data)]
    if not matches:
        print(f"No matches for {keyword}")
        return
    
    with open(output_file, "w", encoding="utf-8") as out:
        for idx in matches[-3:]: # Get the last 3 occurrences (most recent!)
            start = max(0, idx - 500)
            end = min(len(data), idx + 200000)
            chunk = data[start:end]
            # Try to snap to "import React" or "export default"
            clean_start = chunk.rfind("import React")
            if clean_start == -1:
                clean_start = chunk.rfind("export default")
            if clean_start != -1:
                chunk = chunk[clean_start:]
            out.write(f"\n/* ==================== MATCH {idx} ==================== */\n")
            out.write(chunk)

extract_chunks("function HostLiveCampaignBuilder", "turbo_host.tsx")
extract_chunks("function AdminDashboard", "turbo_admin.tsx")
extract_chunks("function CourseProfileClient", "turbo_course.tsx")

print("Done extracting!")
