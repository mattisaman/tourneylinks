import re
with open("turbo_host.tsx", "r", encoding="utf-8") as f:
    turbo = f.read()

with open("src/app/host/page.tsx", "r", encoding="utf-8") as f:
    current = f.read()

# Let's extract the return (...) statement from turbo_host
match = re.search(r'return\s*\(\s*<div.*?>(.*?)</div\>\s*\)\;', turbo, re.DOTALL)
if match:
    print("Found return statment in turbo_host!")
else:
    print("Could not easily parse turbo_host return statement.")

# Just dump the first 100 lines of turbo_host to see what it looks like
print("\n--- First 500 chars of turbo_host ---")
print(turbo[:500])

