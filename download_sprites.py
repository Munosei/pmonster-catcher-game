import requests
import os
import time

# Create folders
os.makedirs('sprites/normal', exist_ok=True)
os.makedirs('sprites/shiny', exist_ok=True)

print("Starting download of all Pokémon sprites from PokeAPI...")
print("This will download 502 images (251 normal + 251 shiny)")
print("-" * 50)

# Download all 251 Pokémon
for i in range(1, 252):
    # Download normal sprite from PokeAPI
    normal_url = f'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/{i}.gif'
    normal_path = f'sprites/normal/{i}.gif'
    
    try:
        response = requests.get(normal_url, timeout=10)
        if response.status_code == 200:
            with open(normal_path, 'wb') as f:
                f.write(response.content)
            print(f'✓ Downloaded normal #{i:3d}')
        else:
            print(f'✗ Failed normal #{i:3d} - Status: {response.status_code}')
    except Exception as e:
        print(f'✗ Error normal #{i:3d}: {e}')
    
    time.sleep(0.05)
    
    # Download shiny sprite from PokeAPI
    shiny_url = f'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/{i}.gif'
    shiny_path = f'sprites/shiny/{i}.gif'
    
    try:
        response = requests.get(shiny_url, timeout=10)
        if response.status_code == 200:
            with open(shiny_path, 'wb') as f:
                f.write(response.content)
            print(f'✓ Downloaded shiny #{i:3d}')
        else:
            print(f'✗ Failed shiny #{i:3d} - Status: {response.status_code}')
    except Exception as e:
        print(f'✗ Error shiny #{i:3d}: {e}')
    
    time.sleep(0.05)

print("-" * 50)
print("Download complete!")
print(f"Normal sprites saved in: sprites/normal/")
print(f"Shiny sprites saved in: sprites/shiny/")