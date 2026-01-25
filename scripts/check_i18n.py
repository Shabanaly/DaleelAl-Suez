import re

def check_translations():
    with open("js/i18n.js", "r", encoding="utf-8") as f:
        content = f.read()
    
    # Extract AR block
    ar_match = re.search(r'ar:\s*\{(.*?)\n\s*\},', content, re.DOTALL)
    en_match = re.search(r'en:\s*\{(.*?)\n\s*\}\s*\};', content, re.DOTALL)
    
    if not ar_match or not en_match:
        print("Could not find translation blocks")
        return
    
    ar_block = ar_match.group(1)
    en_block = en_match.group(1)
    
    # Better regex for keys: find all quoted strings followed by a colon
    # But only those that look like keys (not preceded by :)
    pattern = r'"([^"]*)"\s*:'
    
    ar_keys = set(re.findall(pattern, ar_block))
    en_keys = set(re.findall(pattern, en_block))
    
    missing_in_en = ar_keys - en_keys
    missing_in_ar = en_keys - ar_keys
    
    print(f"Total AR Keys: {len(ar_keys)}")
    print(f"Total EN Keys: {len(en_keys)}")
    
    if missing_in_en:
        print(f"Missing in EN ({len(missing_in_en)}): {sorted(missing_in_en)}")
    else:
        print("No keys missing in EN.")
        
    if missing_in_ar:
        print(f"Missing in AR ({len(missing_in_ar)}): {sorted(missing_in_ar)}")
    else:
        print("No keys missing in AR.")

if __name__ == "__main__":
    check_translations()
