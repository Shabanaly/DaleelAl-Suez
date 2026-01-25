import os
import re

def list_all_sub_keys():
    keys = set()
    
    for root, dirs, files in os.walk("."):
        for file in files:
            if file.endswith(".html"):
                path = os.path.join(root, file)
                with open(path, "r", encoding="utf-8", errors="ignore") as f:
                    file_content = f.read()
                    matches = re.findall(r'data-i18n="(sub_[^"]*)"', file_content)
                    for m in matches:
                        keys.add(m)
    
    print("ALL SUB KEYS IN PROJECT:")
    for k in sorted(keys):
        print(k)

if __name__ == "__main__":
    list_all_sub_keys()
