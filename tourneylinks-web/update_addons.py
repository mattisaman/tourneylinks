import re

with open("src/app/host/page.tsx", "r") as f:
    text = f.read()

# 1. Strip the "e.g. 50/50 Raffle Tickets" from the select option
text = text.replace('<option value="flat">Flat Purchase (e.g. 50/50 Raffle Tickets)</option>', '<option value="flat">Flat Purchase</option>')

with open("src/app/host/page.tsx", "w") as f:
    f.write(text)

