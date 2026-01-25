import os
import re

def check_missing_from_files():
    with open("js/i18n.js", "r", encoding="utf-8") as f:
        content = f.read()
    
    # Extract keys from i18n.js (assuming they are in both AR and EN since previous check passed)
    keys = set(re.findall(r'"([^"]*)"\s*:', content))
    
    missing_keys = set()
    found_keys = set()
    
    for root, dirs, files in os.walk("."):
        for file in files:
            if file.endswith(".html") or file.endswith(".js"):
                path = os.path.join(root, file)
                with open(path, "r", encoding="utf-8", errors="ignore") as f:
                    file_content = f.read()
                    # Find data-i18n="key"
                    matches = re.findall(r'data-i18n="([^"]*)"', file_content)
                    for m in matches:
                        found_keys.add(m)
                        if m not in keys:
                            missing_keys.add((m, path))
    
    print(f"Total Unique data-i18n Keys found in files: {len(found_keys)}")
    if missing_keys:
        print(f"Missing Keys from i18n.js ({len(missing_keys)}):")
        for m, p in sorted(missing_keys):
            print(f"  Key: '{m}' in File: '{p}'")
    else:
        print("All data-i18n keys are present in i18n.js")

if __name__ == "__main__":
    check_missing_from_files()
