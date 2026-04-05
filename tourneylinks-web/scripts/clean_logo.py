import sys
import os

try:
    from PIL import Image
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image

def clean_image():
    input_path = 'public/logo_horizontal_transparent.png'
    output_path = 'public/logo_horizontal_transparent.png' # overwrite
    
    if not os.path.exists(input_path):
        print(f"File not found: {input_path}")
        return
        
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for item in data:
        # If the pixel is low alpha, simply set alpha to 0 (clears faint artifacts and bleed)
        if item[3] > 0 and item[3] < 120:
            new_data.append((item[0], item[1], item[2], 0))
        # If pixel is very dark green (the solid artifact), set alpha to 0
        elif item[0] < 45 and item[1] < 45 and item[2] < 45 and item[3] < 255:
             new_data.append((item[0], item[1], item[2], 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(output_path, 'PNG')
    print(f"Cleaned {output_path}")

if __name__ == '__main__':
    clean_image()
