// Suez Guide Configuration
if (typeof SUPABASE_CONFIG === 'undefined') {
    window.SUPABASE_CONFIG = {
        URL: "https://vzvozvlnnufakkgmzrxh.supabase.co",
        ANON_KEY: "sb_publishable_XC-WUiZW4nu0jtXAKz7dYQ_DdIzLnZi",
        CLOUDINARY_CLOUD_NAME: "dqwkv5gax",
        CLOUDINARY_UPLOAD_PRESET: "daleel_suez_upload"
    };
    
    // Make it globally accessible for our scripts
    window.GUIDE_CONFIG = window.SUPABASE_CONFIG;
}
