import os
import json

# Full Taxonomy Mapping
taxonomy = {
    "restaurants": [
        "popular", "homemade", "grill", "seafood", "traditional", "pizza", "burger",
        "fried_chicken", "shawarma", "international", "family", "budget", "luxury",
        "delivery_only", "open_24h"
    ],
    "cafes": [
        "quiet", "youth", "family", "sea_view", "gaming", "study", "shisha", "no_shisha", "open_24h"
    ],
    "doctors": [
        "internal", "pediatric", "obgyn", "dermatology", "dentist", "ophthalmology",
        "orthopedic", "neurology", "cardiology", "ent", "psychiatry", "slimming",
        "physiotherapy", "lab_xray"
    ],
    "pharmacies": [
        "open_24h", "insurance", "medical_supplies", "cosmetics", "imported_meds", "delivery", "emergency"
    ],
    "shops": [
        "men_clothes", "women_clothes", "kids_clothes", "shoes", "bags_acc", "electronics",
        "mobiles", "computers", "home_tools", "supermarket", "spices", "cosmetics", "jewelry"
    ],
    "services": [
        "plumber", "electrician", "carpenter", "painter", "ac", "appliance_repair",
        "mechanic", "car_electric", "towing", "car_wash", "oil_change", "cleaning_co",
        "pest_control", "moving", "apt_maintenance", "lawyer", "accountant", "clearance", "notary"
    ]
}

# Image Keyword Mapping for better visuals
img_keywords = {
    "restaurants": "food",
    "cafes": "coffee",
    "doctors": "doctor",
    "pharmacies": "pharmacy",
    "shops": "shopping",
    "services": "tools"
}

# Arabic Placeholder Text
desc_map = {
    "restaurants": "أشهى المأكولات وأفضل طرق الطهي مع خدمة متميزة.",
    "cafes": "مكان رائع للاستمتاع بوقتك ومشروبك المفضل في أجواء مريحة.",
    "doctors": "رعاية طبية متميزة بأحدث الأساليب العلمية وبأيدي خبراء.",
    "pharmacies": "توفر جميع الأدوية والمستلزمات الطبية على مدار الساعة.",
    "shops": "تشكيلة متنوعة من أفضل المنتجات التي تناسب كافة الأذواق.",
    "services": "خدمة احترافية وسريعة بأيدي متخصصين لضمان أعلى جودة."
}

def generate_data():
    base_dir = "js/data"
    if not os.path.exists(base_dir):
        os.makedirs(base_dir)

    for dept, subs in taxonomy.items():
        items = []
        item_id = 1
        img_keyword = img_keywords.get(dept, "business")
        
        for sub in subs:
            # Create 2 items per subcategory
            for i in range(1, 3):
                name_ar = f"اسم ديمو {i}" # We expect i18n to handle specific labels, but we provide base names
                slug = f"{dept}-{sub}-{i}"
                
                # Try to make names a bit more descriptive if possible, otherwise generic
                display_name = f"ديمو {sub.replace('_', ' ').capitalize()} {i}"
                
                item = {
                    "id": item_id,
                    "name": display_name,
                    "slug": slug,
                    "category": dept,
                    "subCategory": sub,
                    "address": "السويس، مصر",
                    "phone": "01000000000",
                    "hours": "9 ص - 11 م",
                    "description": desc_map[dept],
                    "image": f"https://images.unsplash.com/photo-{1500000000000 + item_id}?w=800&fit=crop&q=60&{img_keyword}",
                    "map": "https://www.google.com/maps?q=suez&output=embed"
                }
                items.append(item)
                item_id += 1
        
        # Write to JS file
        file_path = os.path.join(base_dir, f"{dept}.js")
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(f"var {dept} = ")
            f.write(json.dumps(items, indent=4, ensure_ascii=False))
            f.write(";")
        print(f"Generated {len(items)} items for {dept}.js")

if __name__ == "__main__":
    generate_data()
