// frontend/src/seo/routes.js

// Sitemap'e girecek (public) sayfalar:
export const PUBLIC_ROUTES = [
    "/",
    "/study",
    "/study/roots",
    "/study/prefixes",
    "/games",
];

// Sitemap'e girmeyecek / indexlenmesi istenmeyen sayfalar:
export const NOINDEX_ROUTES = [
    "/login",
    "/register",
    "/flashcards",
    "/match",
    "/quiz",
    "/progress",
    "/profile",
];
