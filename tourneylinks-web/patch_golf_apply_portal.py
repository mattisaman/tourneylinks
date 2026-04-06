import re

with open("src/app/api/tournaments/[id]/golf-apply/route.ts", "r") as f:
    text = f.read()

target = """                     <div style="display: flex; justify-content: center; gap: 1rem;">
                        <a href="${approveUrl}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">✅ APPROVE (Connect Treasury)</a>
                        <a href="${denyUrl}" style="background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">❌ DENY (Revert to Standard)</a>
                     </div>"""

replacement = """                     <div style="display: flex; justify-content: center; gap: 1rem;">
                        <a href="${baseUrl}/admin/portal/${tournament.id}?token=${adminToken}" style="background-color: #1a1a1a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">🔒 Access Secure Admin Portal</a>
                     </div>"""

if target in text:
    text = text.replace(target, replacement)
    
    # Let's also update the text to accurately reflect the portal logic
    text = text.replace("Clicking these buttons will instantly mutate the database", "Clicking this link will securely open the administrative dashboard port to finalize your decision.")
    
    with open("src/app/api/tournaments/[id]/golf-apply/route.ts", "w") as f:
        f.write(text)
    print("SUCCESS")
else:
    print("FAILED")

