// Medical Prefixes Data - Organized by Categories
// Each category contains medical prefix terms

export const medicalPrefixes = [
    {
        category: 'Olumsuzluk / Yokluk',
        prefixes: [
            { id: 'prefix-neg-1', prefix: 'a-', meaning: 'yok, olmayan' },
            { id: 'prefix-neg-2', prefix: 'an-', meaning: 'yok, olmayan (ünlü önünde)' },
            { id: 'prefix-neg-3', prefix: 'in-', meaning: 'değil, olmayan' },
            { id: 'prefix-neg-4', prefix: 'im-', meaning: 'değil, olmayan (b, m, p önünde)' },
            { id: 'prefix-neg-5', prefix: 'il-', meaning: 'değil, olmayan (l önünde)' },
            { id: 'prefix-neg-6', prefix: 'ir-', meaning: 'değil, olmayan (r önünde)' },
            { id: 'prefix-neg-7', prefix: 'non-', meaning: 'değil, olmayan' },
            { id: 'prefix-neg-8', prefix: 'un-', meaning: 'değil, zıt' },
            { id: 'prefix-neg-9', prefix: 'de-', meaning: 'uzaklaşma, azalma, tersine çevirme' },
            { id: 'prefix-neg-10', prefix: 'dis-', meaning: 'ayrılma, yokluk' },
            { id: 'prefix-neg-11', prefix: 'null-', meaning: 'hiç, sıfır' },
            { id: 'prefix-neg-12', prefix: 'contra-', meaning: 'karşı, zıt' },
            { id: 'prefix-neg-13', prefix: 'counter-', meaning: 'karşı, zıt' },
        ]
    },
    {
        category: 'Miktar / Derece',
        prefixes: [
            { id: 'prefix-qty-1', prefix: 'mono-', meaning: 'bir, tek' },
            { id: 'prefix-qty-2', prefix: 'uni-', meaning: 'bir, tek' },
            { id: 'prefix-qty-3', prefix: 'bi-', meaning: 'iki, çift' },
            { id: 'prefix-qty-4', prefix: 'di-', meaning: 'iki' },
            { id: 'prefix-qty-5', prefix: 'tri-', meaning: 'üç' },
            { id: 'prefix-qty-6', prefix: 'quadri-', meaning: 'dört' },
            { id: 'prefix-qty-7', prefix: 'tetra-', meaning: 'dört' },
            { id: 'prefix-qty-8', prefix: 'multi-', meaning: 'çok, birçok' },
            { id: 'prefix-qty-9', prefix: 'poly-', meaning: 'çok, fazla' },
            { id: 'prefix-qty-10', prefix: 'pan-', meaning: 'tüm, hepsi' },
            { id: 'prefix-qty-11', prefix: 'hemi-', meaning: 'yarım' },
            { id: 'prefix-qty-12', prefix: 'semi-', meaning: 'yarım, kısmi' },
            { id: 'prefix-qty-13', prefix: 'oligo-', meaning: 'az, yetersiz' },
            { id: 'prefix-qty-14', prefix: 'micro-', meaning: 'küçük, mikroskobik' },
            { id: 'prefix-qty-15', prefix: 'macro-', meaning: 'büyük, geniş' },
            { id: 'prefix-qty-16', prefix: 'mega-', meaning: 'çok büyük, dev' },
            { id: 'prefix-qty-17', prefix: 'hyper-', meaning: 'fazla, aşırı, yüksek' },
            { id: 'prefix-qty-18', prefix: 'hypo-', meaning: 'az, eksik, düşük' },
            { id: 'prefix-qty-19', prefix: 'super-', meaning: 'üstünde, aşırı' },
            { id: 'prefix-qty-20', prefix: 'ultra-', meaning: 'aşırı, ötesinde' },
            { id: 'prefix-qty-21', prefix: 'iso-', meaning: 'eşit, aynı' },
            { id: 'prefix-qty-22', prefix: 'equi-', meaning: 'eşit' },
            { id: 'prefix-qty-23', prefix: 'primi-', meaning: 'ilk' },
            { id: 'prefix-qty-24', prefix: 'nulli-', meaning: 'hiç, sıfır' },
        ]
    },
    {
        category: 'Yön / Konum',
        prefixes: [
            { id: 'prefix-dir-1', prefix: 'ante-', meaning: 'önce, öncesi' },
            { id: 'prefix-dir-2', prefix: 'pre-', meaning: 'önce, öncesi' },
            { id: 'prefix-dir-3', prefix: 'pro-', meaning: 'önce, ileriye' },
            { id: 'prefix-dir-4', prefix: 'post-', meaning: 'sonra, arkası' },
            { id: 'prefix-dir-5', prefix: 'retro-', meaning: 'geri, arkaya' },
            { id: 'prefix-dir-6', prefix: 'ab-', meaning: 'uzakta, uzaklaşma' },
            { id: 'prefix-dir-7', prefix: 'ad-', meaning: 'doğru, yaklaşma' },
            { id: 'prefix-dir-8', prefix: 'endo-', meaning: 'içinde, iç' },
            { id: 'prefix-dir-9', prefix: 'intra-', meaning: 'içinde, iç' },
            { id: 'prefix-dir-10', prefix: 'ecto-', meaning: 'dışında, dış' },
            { id: 'prefix-dir-11', prefix: 'exo-', meaning: 'dışında, dış' },
            { id: 'prefix-dir-12', prefix: 'extra-', meaning: 'dışında, ötesinde' },
            { id: 'prefix-dir-13', prefix: 'epi-', meaning: 'üzerinde, üst' },
            { id: 'prefix-dir-14', prefix: 'supra-', meaning: 'üzerinde, üstünde' },
            { id: 'prefix-dir-15', prefix: 'super-', meaning: 'üzerinde, üstünde' },
            { id: 'prefix-dir-16', prefix: 'sub-', meaning: 'altında, alt' },
            { id: 'prefix-dir-17', prefix: 'infra-', meaning: 'altında, aşağıda' },
            { id: 'prefix-dir-18', prefix: 'inter-', meaning: 'arasında, arası' },
            { id: 'prefix-dir-19', prefix: 'meso-', meaning: 'orta, ortada' },
            { id: 'prefix-dir-20', prefix: 'meta-', meaning: 'ötesinde, değişim, sonra' },
            { id: 'prefix-dir-21', prefix: 'para-', meaning: 'yanında, yakın' },
            { id: 'prefix-dir-22', prefix: 'peri-', meaning: 'çevresinde, etrafında' },
            { id: 'prefix-dir-23', prefix: 'circum-', meaning: 'çevresinde, etrafında' },
            { id: 'prefix-dir-24', prefix: 'trans-', meaning: 'karşıdan, ötesinde, geçiş' },
            { id: 'prefix-dir-25', prefix: 'dia-', meaning: 'boyunca, arasından' },
            { id: 'prefix-dir-26', prefix: 'per-', meaning: 'boyunca, içinden' },
            { id: 'prefix-dir-27', prefix: 'latero-', meaning: 'yan, yandan' },
            { id: 'prefix-dir-28', prefix: 'medio-', meaning: 'orta, ortadan' },
            { id: 'prefix-dir-29', prefix: 'dextro-', meaning: 'sağ, sağa' },
            { id: 'prefix-dir-30', prefix: 'sinistro-', meaning: 'sol, sola' },
            { id: 'prefix-dir-31', prefix: 'antero-', meaning: 'ön, öne' },
            { id: 'prefix-dir-32', prefix: 'postero-', meaning: 'arka, arkaya' },
        ]
    },
    {
        category: 'Birliktelik / Süreç',
        prefixes: [
            { id: 'prefix-proc-1', prefix: 'syn-', meaning: 'birlikte, ile' },
            { id: 'prefix-proc-2', prefix: 'sym-', meaning: 'birlikte, ile (b, m, p önünde)' },
            { id: 'prefix-proc-3', prefix: 'con-', meaning: 'birlikte, ile' },
            { id: 'prefix-proc-4', prefix: 'com-', meaning: 'birlikte, ile (b, m, p önünde)' },
            { id: 'prefix-proc-5', prefix: 'co-', meaning: 'birlikte, ortak' },
            { id: 'prefix-proc-6', prefix: 'ana-', meaning: 'yukarı, yeniden, geri' },
            { id: 'prefix-proc-7', prefix: 'cata-', meaning: 'aşağı, yıkım' },
            { id: 'prefix-proc-8', prefix: 'auto-', meaning: 'kendi, otomatik' },
            { id: 'prefix-proc-9', prefix: 'hetero-', meaning: 'farklı, başka' },
            { id: 'prefix-proc-10', prefix: 'homo-', meaning: 'aynı, benzer' },
            { id: 'prefix-proc-11', prefix: 'allo-', meaning: 'başka, farklı' },
            { id: 'prefix-proc-12', prefix: 're-', meaning: 'tekrar, yeniden, geri' },
            { id: 'prefix-proc-13', prefix: 'neo-', meaning: 'yeni' },
            { id: 'prefix-proc-14', prefix: 'paleo-', meaning: 'eski, eskiden' },
            { id: 'prefix-proc-15', prefix: 'pseudo-', meaning: 'sahte, yalancı' },
            { id: 'prefix-proc-16', prefix: 'eu-', meaning: 'iyi, normal' },
            { id: 'prefix-proc-17', prefix: 'dys-', meaning: 'kötü, zor, anormal' },
            { id: 'prefix-proc-18', prefix: 'mal-', meaning: 'kötü, hatalı' },
            { id: 'prefix-proc-19', prefix: 'brady-', meaning: 'yavaş' },
            { id: 'prefix-proc-20', prefix: 'tachy-', meaning: 'hızlı' },
            { id: 'prefix-proc-21', prefix: 'ortho-', meaning: 'düz, doğru, normal' },
            { id: 'prefix-proc-22', prefix: 'hetero-', meaning: 'farklı, değişik' },
        ]
    },
    {
        category: 'Zaman / Sıklık',
        prefixes: [
            { id: 'prefix-time-1', prefix: 'ante-', meaning: 'önce, önceden' },
            { id: 'prefix-time-2', prefix: 'pre-', meaning: 'önce, önceden' },
            { id: 'prefix-time-3', prefix: 'post-', meaning: 'sonra, sonradan' },
            { id: 'prefix-time-4', prefix: 'peri-', meaning: 'çevresinde, sırasında' },
            { id: 'prefix-time-5', prefix: 'neo-', meaning: 'yeni' },
            { id: 'prefix-time-6', prefix: 'paleo-', meaning: 'eski' },
            { id: 'prefix-time-7', prefix: 'primi-', meaning: 'ilk' },
            { id: 'prefix-time-8', prefix: 'proto-', meaning: 'ilk, başlangıç' },
            { id: 'prefix-time-9', prefix: 'pre-natal', meaning: 'doğum öncesi' },
            { id: 'prefix-time-10', prefix: 'post-natal', meaning: 'doğum sonrası' },
            { id: 'prefix-time-11', prefix: 'ante-mortem', meaning: 'ölüm öncesi' },
            { id: 'prefix-time-12', prefix: 'post-mortem', meaning: 'ölüm sonrası' },
            { id: 'prefix-time-13', prefix: 'pre-operative', meaning: 'ameliyat öncesi' },
            { id: 'prefix-time-14', prefix: 'post-operative', meaning: 'ameliyat sonrası' },
            { id: 'prefix-time-15', prefix: 'intra-operative', meaning: 'ameliyat sırasında' },
            { id: 'prefix-time-16', prefix: 'acute-', meaning: 'akut, ani, şiddetli' },
            { id: 'prefix-time-17', prefix: 'chronic-', meaning: 'kronik, süreğen' },
            { id: 'prefix-time-18', prefix: 'sub-acute', meaning: 'yarı akut' },
        ]
    }
];

// Helper function to get all categories
export const getCategories = () => {
    return medicalPrefixes.map(item => item.category);
};

// Helper function to get prefixes for a category
export const getPrefixesByCategory = (categoryName) => {
    const category = medicalPrefixes.find(item => item.category === categoryName);
    return category ? category.prefixes : [];
};

// Helper function to search prefixes
export const searchPrefixes = (query) => {
    const results = [];
    const lowerQuery = query.toLowerCase();

    medicalPrefixes.forEach(category => {
        const matchingPrefixes = category.prefixes.filter(prefix =>
            prefix.prefix.toLowerCase().includes(lowerQuery) ||
            prefix.meaning.toLowerCase().includes(lowerQuery)
        );

        if (matchingPrefixes.length > 0) {
            results.push({
                category: category.category,
                prefixes: matchingPrefixes
            });
        }
    });

    return results;
};
