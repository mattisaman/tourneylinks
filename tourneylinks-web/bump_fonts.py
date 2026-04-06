import re

with open("src/app/host/page.tsx", "r") as f:
    text = f.read()

# Bump font sizes universally that represent "help text"
text = re.sub(r"fontSize:\s*'0.65rem'", "fontSize: '0.75rem'", text)
text = re.sub(r"fontSize:\s*'0.7rem'", "fontSize: '0.8rem'", text)

# Reduce excessive padding on inline forms to save vertical/horizontal space
text = re.sub(r"padding:\s*'1.5rem'", "padding: '1.2rem'", text)

with open("src/app/host/page.tsx", "w") as f:
    f.write(text)

