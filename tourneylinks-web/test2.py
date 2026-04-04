import re

with open("src/app/host/page.tsx", "r") as f:
    text = f.read()

def find_unmatched(s):
    stack = []
    # Ignore stuff inside JSX and strings? 
    # That might be too complex for simple stack, let's just use babel.
    pass

