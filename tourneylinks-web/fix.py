import re

with open("src/app/host/page.tsx", "r") as f:
    content = f.read()

# The missing `</div>` at the end of addons.
# Let's locate the Add-ons block end.
# It ends with:
#                ))}
#             </div>
#             <div className="wizard-card" style={{ marginBottom: '2rem' }}>
#              <div className="wizard-card-title">Setup Donations & 501(c)(3) Entity</div>

addons_end_pattern = r"(\s*\}\)\)\n\s*</div\>)\n(\s*\<div className=\"wizard-card\" style=\{\{ marginBottom: '2rem' \}\}\>\n\s*\<div className=\"wizard-card-title\"\>Setup Donations \& 501\(c\)\(3\) Entity\</div\>)"

if re.search(addons_end_pattern, content):
    print("Found missing div location!")
    content = re.sub(addons_end_pattern, r"\1\n         </div>\n\n\2", content)
else:
    print("Could not find the missing div location.")

# Now we want to move Setup Donations to Content Tab!
setup_donations_start = r"(\s*\<div className=\"wizard-card\" style=\{\{ marginBottom: '2rem' \}\}\>\n\s*\<div className=\"wizard-card-title\"\>Setup Donations \& 501\(c\)\(3\) Entity\</div\>)"

# Setup donations ends with:
#                )}
#             </div>
#          </div>
#
#         <div className="wizard-card" style={{ marginBottom: '2rem' }}>
#            <div className="wizard-card-title">Prizes & Raffles</div>

setup_donations_end_pattern = r"(?s)(Setup Donations & 501\(c\)\(3\) Entity.*?\{\s*charityType === 'own' && \(.*?\)\s*\}\s*\</div\>\s*\</div\>)\n"

match = re.search(setup_donations_end_pattern, content)
if match:
    print("Found Setup Donations block!")
    block = match.group(1)
    
    # Remove block from its current location
    content = content.replace(block + "\n", "", 1)
    
    # Insert block before Tournament Logistics in renderContentTab
    logistics_pattern = r"(\s*\<div className=\"wizard-card\" style=\{\{ marginBottom: '2rem' \}\}\>\n\s*\<div className=\"wizard-card-title\"\>Tournament Logistics\</div\>)"
    if re.search(logistics_pattern, content):
        content = re.sub(logistics_pattern, f"\n{block}\n\\1", content, count=1)
        print("Injected into Tournament Logistics.")
    else:
        print("Could not find Tournament Logistics.")
else:
    print("Could not find Setup Donations block.")

with open("src/app/host/page.tsx", "w") as f:
    f.write(content)

print("Done!")
