// Medical Roots Data - Organized by Body Systems
// Each system contains subcategories with medical root terms

export const medicalRoots = [
    {
        system: 'Hareket Sistemi',
        subcategories: [
            {
                name: 'İskelet Sistemi',
                roots: [
                    { id: 'mv-root-1', root: 'Oste/o', meaning: 'kemik' },
                    { id: 'mv-root-1b', root: 'Osse/o', meaning: 'kemik' },
                    { id: 'mv-root-2', root: 'Crani/o', meaning: 'kafatası' },
                    { id: 'mv-root-2b', root: 'Cephal/o', meaning: 'baş' },
                    { id: 'mv-root-2c', root: 'Front/o', meaning: 'alın kemiği' },
                    { id: 'mv-root-2d', root: 'Occipit/o', meaning: 'ense kemiği' },
                    { id: 'mv-root-2e', root: 'Tempor/o', meaning: 'şakak kemiği' },
                    { id: 'mv-root-2f', root: 'Sphen/o', meaning: 'kama kemiği' },
                    { id: 'mv-root-2g', root: 'Mandibul/o', meaning: 'alt çene' },
                    { id: 'mv-root-2h', root: 'Maxill/o', meaning: 'üst çene' },
                    { id: 'mv-root-2i', root: 'Zygomat/o', meaning: 'elmacık kemiği' },
                    { id: 'mv-root-3', root: 'Vertebr/o', meaning: 'omur' },
                    { id: 'mv-root-4', root: 'Spondyl/o', meaning: 'omurga' },
                    { id: 'mv-root-5', root: 'Cost/o', meaning: 'kaburga' },
                    { id: 'mv-root-6', root: 'Stern/o', meaning: 'göğüs kemiği' },
                    { id: 'mv-root-6b', root: 'Xiph/o', meaning: 'kılıç çıkıntısı (göğüs kemiği ucu)' },
                    { id: 'mv-root-7', root: 'Clavicul/o', meaning: 'köprücük kemiği' },
                    { id: 'mv-root-8', root: 'Scapul/o', meaning: 'kürek kemiği' },
                    { id: 'mv-root-8b', root: 'Acromi/o', meaning: 'akromion (omuz çıkıntısı)' },
                    { id: 'mv-root-8c', root: 'Glen/o', meaning: 'glenoid (omuz çukuru)' },
                    { id: 'mv-root-9', root: 'Humer/o', meaning: 'kol kemiği' },
                    { id: 'mv-root-10', root: 'Radi/o', meaning: 'ön kol kemiği (radius)' },
                    { id: 'mv-root-11', root: 'Uln/o', meaning: 'dirsek kemiği (ulna)' },
                    { id: 'mv-root-11b', root: 'Olecran/o', meaning: 'dirsek çıkıntısı' },
                    { id: 'mv-root-12', root: 'Carp/o', meaning: 'el bilek kemiği' },
                    { id: 'mv-root-13', root: 'Metacarp/o', meaning: 'el ayası kemiği' },
                    { id: 'mv-root-14', root: 'Phalang/o', meaning: 'parmak kemiği' },
                    { id: 'mv-root-15', root: 'Pelv/o', meaning: 'leğen kemiği' },
                    { id: 'mv-root-16', root: 'Ili/o', meaning: 'leğen kemiği kanadı' },
                    { id: 'mv-root-17', root: 'Ischi/o', meaning: 'oturma kemiği' },
                    { id: 'mv-root-18', root: 'Pub/o', meaning: 'kasık kemiği' },
                    { id: 'mv-root-19', root: 'Acetabul/o', meaning: 'kalça çukuru' },
                    { id: 'mv-root-20', root: 'Femur/o', meaning: 'uyluk kemiği' },
                    { id: 'mv-root-21', root: 'Patell/o', meaning: 'diz kapağı' },
                    { id: 'mv-root-22', root: 'Tibi/o', meaning: 'kaval kemiği' },
                    { id: 'mv-root-23', root: 'Fibul/o', meaning: 'ince baldır kemiği' },
                    { id: 'mv-root-23b', root: 'Malleol/o', meaning: 'ayak bileği çıkıntısı' },
                    { id: 'mv-root-24', root: 'Tars/o', meaning: 'ayak bilek kemiği' },
                    { id: 'mv-root-25', root: 'Calcane/o', meaning: 'topuk kemiği' },
                    { id: 'mv-root-26', root: 'Metatars/o', meaning: 'ayak tabanı kemiği' },
                    { id: 'mv-root-27', root: 'Lumb/o', meaning: 'bel' },
                    { id: 'mv-root-28', root: 'Sacr/o', meaning: 'sakrum (kuyruk sokumu üstü)' },
                    { id: 'mv-root-29', root: 'Coccyg/o', meaning: 'kuyruk sokumu' },
                ]
            },
            {
                name: 'Eklemler & Hareket',
                roots: [
                    { id: 'mv-root-27', root: 'Arthr/o', meaning: 'eklem' },
                    { id: 'mv-root-28', root: 'Articul/o', meaning: 'eklem' },
                    { id: 'mv-root-29', root: 'Synovi/o', meaning: 'eklem sıvısı / zarı' },
                    { id: 'mv-root-30', root: 'Burs/o', meaning: 'bursa (eklem kesesi)' },
                ]
            },
            {
                name: 'Kas Sistemi',
                roots: [
                    { id: 'mv-root-38', root: 'Brachi/o', meaning: 'kol' },
                    { id: 'mv-root-39', root: 'Muscul/o', meaning: 'kas' },
                    { id: 'mv-root-40', root: 'My/o', meaning: 'kas' },
                    { id: 'mv-root-41', root: 'Myos/o', meaning: 'kas' },
                    { id: 'mv-root-42', root: 'Tendin/o', meaning: 'tendon (kirişi)' },
                    { id: 'mv-root-43', root: 'Ten/o', meaning: 'tendon' },
                    { id: 'mv-root-44', root: 'Tenosynovi/o', meaning: 'tendon kılıfı' },
                    { id: 'mv-root-45', root: 'Fasci/o', meaning: 'fasya (kas zarı)' },
                ]
            },
            {
                name: 'Destek Dokuları',
                roots: [
                    { id: 'mv-root-46', root: 'Cartilagin/o', meaning: 'kıkırdak' },
                    { id: 'mv-root-47', root: 'Chondr/o', meaning: 'kıkırdak' },
                    { id: 'mv-root-48', root: 'Fibr/o', meaning: 'lif / bağ dokusu' },
                    { id: 'mv-root-49', root: 'Medull/o', meaning: 'ilik / medulla' },
                    { id: 'mv-root-50', root: 'Myel/o', meaning: 'kemik iliği' },
                ]
            },
            {
                name: 'Bölgesel Anatomi',
                roots: [
                    { id: 'mv-root-51', root: 'Cervic/o', meaning: 'boyun' },
                    { id: 'mv-root-52', root: 'Facio', meaning: 'yüz' },
                    { id: 'mv-root-53', root: 'Phren/o', meaning: 'diyafram' },
                    { id: 'mv-root-54', root: 'Thorac/o', meaning: 'göğüs' },
                    { id: 'mv-root-55', root: 'Pariet/o', meaning: 'duvar / parietal' },
                ]
            },
            {
                name: 'İşlev & Hareket Kökleri',
                roots: [
                    { id: 'mv-root-56', root: 'Kinesi/o', meaning: 'hareket' },
                    { id: 'mv-root-57', root: 'Ton/o', meaning: 'basınç / gerilim' },
                    { id: 'mv-root-58', root: 'Duct/o', meaning: 'çekmek, iletmek' },
                    { id: 'mv-root-59', root: 'Electr/o', meaning: 'elektrik' },
                    { id: 'mv-root-60', root: 'Hydr/o', meaning: 'su' },
                ]
            },
            {
                name: 'Şekil & Duruş Bozuklukları',
                roots: [
                    { id: 'mv-root-61', root: 'Ankyl/o', meaning: 'eğri, bükük' },
                    { id: 'mv-root-62', root: 'Kyph/o', meaning: 'kambur' },
                    { id: 'mv-root-63', root: 'Lord/o', meaning: 'çukurlaşmış' },
                    { id: 'mv-root-64', root: 'Scoli/o', meaning: 'eğri' },
                    { id: 'mv-root-65', root: 'Orth/o', meaning: 'düz, doğru' },
                    { id: 'mv-root-66', root: 'Rhabd/o', meaning: 'çubuk şeklinde' },
                ]
            }
        ]
    },
    {
        system: 'Solunum Sistemi',
        subcategories: [
            {
                name: 'Burun & Sinüsler',
                roots: [
                    { id: 'rs-root-1', root: 'Alveol/o', meaning: 'alveoller' },
                    { id: 'rs-root-2', root: 'Bronchi/o', meaning: 'bronş' },
                    { id: 'rs-root-3', root: 'Bronch/o', meaning: 'bronş' },
                    { id: 'rs-root-4', root: 'Bronchiol/o', meaning: 'bronşioller' },
                    { id: 'rs-root-5', root: 'Laryng/o', meaning: 'larenks' },
                    { id: 'rs-root-6', root: 'Pharyng/o', meaning: 'farenks' },
                    { id: 'rs-root-7', root: 'Trache/o', meaning: 'trakea' },
                    { id: 'rs-root-8', root: 'Pneumon/o', meaning: 'akciğer' },
                    { id: 'rs-root-9', root: 'Pulmon/o', meaning: 'akciğer' },
                    { id: 'rs-root-10', root: 'Pleur/a', meaning: 'plevra' },
                    { id: 'rs-root-11', root: 'Pleur/o', meaning: 'plevra' },
                    { id: 'rs-root-12', root: 'Tonsill/o', meaning: 'bademcikler' },
                ]
            },
            {
                name: 'Göğüs Kafesi',
                roots: [
                    { id: 'rs-root-5', root: 'Thorac/o', meaning: 'göğüs' },
                    { id: 'rs-root-6', root: 'Pleur/o', meaning: 'akciğer zarı' },
                    { id: 'rs-root-7', root: 'Mediastin/o', meaning: 'göğüs boşluğu ortası' },
                ]
            },
            {
                name: 'Solunum Bezleri & Salgılar',
                roots: [
                    { id: 'rs-root-13', root: 'Adenoid/o', meaning: 'bezler' },
                    { id: 'rs-root-14', root: 'Lob/o', meaning: 'lob' },
                    { id: 'rs-root-15', root: 'Muc/o', meaning: 'mukus' },
                ]
            },
            {
                name: 'Solunum Kasları (Diyafram)',
                roots: [
                    { id: 'rs-root-11', root: 'Phren/o', meaning: 'diyafram' },
                    { id: 'rs-root-12', root: 'Diaphragmat/o', meaning: 'diyafram' },
                ]
            },
            {
                name: 'Solunum Eylemi',
                roots: [
                    { id: 'rs-root-16', root: 'Spir/o', meaning: 'solunum' },
                    { id: 'rs-root-17', root: 'Ox/o', meaning: 'oksijen' },
                    { id: 'rs-root-18', root: 'Pneumat/o', meaning: 'hava / solunum' },
                    { id: 'rs-root-19', root: 'Pneum/o', meaning: 'hava / solunum' },
                ]
            }
        ]
    },
    {
        system: 'Dolaşım Sistemi',
        subcategories: [
            {
                name: 'Kalbin Anatomisi',
                roots: [
                    { id: 'cs-root-1', root: 'Cardi/o', meaning: 'kalp' },
                    { id: 'cs-root-2', root: 'Coron/o', meaning: 'koroner (kalp damarı)' },
                    { id: 'cs-root-3', root: 'Atri/o', meaning: 'kulakçık' },
                    { id: 'cs-root-4', root: 'Ventricul/o', meaning: 'karıncık' },
                    { id: 'cs-root-5', root: 'Valvul/o', meaning: 'kapakçık' },
                    { id: 'cs-root-6', root: 'Myocardi/o', meaning: 'kalp kası' },
                    { id: 'cs-root-7', root: 'Pericardi/o', meaning: 'kalp zarı' },
                    { id: 'cs-root-8', root: 'Endocardi/o', meaning: 'kalp iç zarı' },
                ]
            },
            {
                name: 'Damar Ağı (Vasküler Yapı)',
                roots: [
                    { id: 'cs-root-9', root: 'Angi/o', meaning: 'damar' },
                    { id: 'cs-root-10', root: 'Vas/o', meaning: 'damar' },
                    { id: 'cs-root-11', root: 'Vascul/o', meaning: 'damar' },
                    { id: 'cs-root-12', root: 'Arteri/o', meaning: 'arter' },
                    { id: 'cs-root-13', root: 'Arteriol/o', meaning: 'küçük arter' },
                    { id: 'cs-root-14', root: 'Phleb/o', meaning: 'ven (toplardamar)' },
                    { id: 'cs-root-15', root: 'Ven/o', meaning: 'ven' },
                    { id: 'cs-root-16', root: 'Venul/o', meaning: 'küçük ven' },
                    { id: 'cs-root-17', root: 'Capillar/o', meaning: 'kılcal damar' },
                    { id: 'cs-root-18', root: 'Aort/o', meaning: 'aort (ana atardamar)' },
                ]
            },
            {
                name: 'İşlev & Dinamikler',
                roots: [
                    { id: 'cs-root-19', root: 'Hem/o', meaning: 'kan' },
                    { id: 'cs-root-20', root: 'Hemat/o', meaning: 'kan' },
                    { id: 'cs-root-21', root: 'Sphygm/o', meaning: 'nabız' },
                    { id: 'cs-root-22', root: 'Rhythm/o', meaning: 'ritim' },
                    { id: 'cs-root-23', root: 'Tens/o', meaning: 'basınç / tansiyon' },
                ]
            },
            {
                name: 'Hastalık Süreçleri & Bozukluklar',
                roots: [
                    { id: 'cs-root-24', root: 'Ather/o', meaning: 'yağ birikintisi / plak' },
                    { id: 'cs-root-25', root: 'Thromb/o', meaning: 'pıhtı' },
                    { id: 'cs-root-26', root: 'Embol/o', meaning: 'tıkaç / emboli' },
                    { id: 'cs-root-27', root: 'Isch/o', meaning: 'kan akışının kesilmesi' },
                    { id: 'cs-root-28', root: 'Infarct/o', meaning: 'doku ölümü' },
                    { id: 'cs-root-29', root: 'Stenos/o', meaning: 'daralma' },
                    { id: 'cs-root-30', root: 'Aneurysm/o', meaning: 'damar şişmesi' },
                ]
            },
            {
                name: 'Tanı & Görüntüleme Yöntemleri',
                roots: [
                    { id: 'cs-root-31', root: 'Electr/o', meaning: 'elektrik' },
                    { id: 'cs-root-32', root: 'Echo', meaning: 'yankı / ultrason' },
                    { id: 'cs-root-33', root: 'Angi/o + -graphy', meaning: 'damar görüntüleme' },
                ]
            }
        ]
    },
    {
        system: 'Sindirim Sistemi',
        subcategories: [
            {
                name: 'Karaciğer & Safra Sistemi',
                roots: [
                    { id: 'ds-root-1', root: 'Hepat/o', meaning: 'karaciğer' },
                    { id: 'ds-root-2', root: 'Chol/e', meaning: 'safra' },
                    { id: 'ds-root-3', root: 'Cholecyst/o', meaning: 'safra kesesi' },
                    { id: 'ds-root-4', root: 'Choledoch/o', meaning: 'ana safra kanalı' },
                ]
            },
            {
                name: 'Karın & Periton',
                roots: [
                    { id: 'ds-root-5', root: 'Abdomin/o', meaning: 'karın' },
                    { id: 'ds-root-6', root: 'Celi/o', meaning: 'karın boşluğu' },
                    { id: 'ds-root-7', root: 'Lapar/o', meaning: 'karın duvarı' },
                    { id: 'ds-root-8', root: 'Periton/o', meaning: 'karın zarı' },
                ]
            },
            {
                name: 'Diğer Anatomik Yapılar',
                roots: [
                    { id: 'ds-root-9', root: 'Or/o', meaning: 'ağız' },
                    { id: 'ds-root-10', root: 'Stomat/o', meaning: 'ağız' },
                    { id: 'ds-root-11', root: 'Gloss/o', meaning: 'dil' },
                    { id: 'ds-root-12', root: 'Lingu/o', meaning: 'dil' },
                    { id: 'ds-root-13', root: 'Gingiv/o', meaning: 'diş eti' },
                    { id: 'ds-root-14', root: 'Dent/o', meaning: 'diş' },
                    { id: 'ds-root-15', root: 'Odont/o', meaning: 'diş' },
                    { id: 'ds-root-16', root: 'Pharyng/o', meaning: 'yutak' },
                    { id: 'ds-root-17', root: 'Esophag/o', meaning: 'yemek borusu' },
                    { id: 'ds-root-18', root: 'Gastr/o', meaning: 'mide' },
                    { id: 'ds-root-19', root: 'Pylor/o', meaning: 'mide kapısı' },
                    { id: 'ds-root-20', root: 'Duoden/o', meaning: 'onikiparmak bağırsağı' },
                    { id: 'ds-root-21', root: 'Jejun/o', meaning: 'açlık bağırsağı' },
                    { id: 'ds-root-22', root: 'Ile/o', meaning: 'ileum (ince bağırsak sonu)' },
                    { id: 'ds-root-23', root: 'Enter/o', meaning: 'bağırsak' },
                    { id: 'ds-root-24', root: 'Col/o', meaning: 'kolon (kalın bağırsak)' },
                    { id: 'ds-root-25', root: 'Colon/o', meaning: 'kolon' },
                    { id: 'ds-root-26', root: 'Sigmoid/o', meaning: 'sigmoid kolon' },
                    { id: 'ds-root-27', root: 'Rect/o', meaning: 'rektum' },
                    { id: 'ds-root-28', root: 'Proct/o', meaning: 'anüs / rektum' },
                    { id: 'ds-root-29', root: 'An/o', meaning: 'anüs' },
                    { id: 'ds-root-30', root: 'Pancreat/o', meaning: 'pankreas' },
                    { id: 'ds-root-31', root: 'Splen/o', meaning: 'dalak' },
                ]
            },
            {
                name: 'İşlev & Dinamikler',
                roots: [
                    { id: 'ds-root-32', root: 'Phag/o', meaning: 'yemek / yutma' },
                    { id: 'ds-root-33', root: 'Peps/o', meaning: 'sindirim' },
                    { id: 'ds-root-34', root: 'Peristal/o', meaning: 'peristaltik hareket' },
                ]
            },
            {
                name: 'Hastalık Süreçleri & Bozukluklar',
                roots: [
                    { id: 'ds-root-35', root: 'Ulcer/o', meaning: 'ülser / yara' },
                    { id: 'ds-root-36', root: 'Polyp/o', meaning: 'polip' },
                    { id: 'ds-root-37', root: 'Diverticul/o', meaning: 'kese çıkıntısı' },
                    { id: 'ds-root-38', root: 'Herni/o', meaning: 'fıtık' },
                ]
            },
            {
                name: 'Tanı & Görüntüleme Yöntemleri',
                roots: [
                    { id: 'ds-root-39', root: '-scopy', meaning: 'bakma / muayene' },
                    { id: 'ds-root-40', root: 'Endoscop/o', meaning: 'içini görme aleti' },
                ]
            },
            {
                name: 'Sindirimdeki Maddeler ve İçerikler',
                roots: [
                    { id: 'ds-root-41', root: 'Sial/o', meaning: 'tükürük' },
                    { id: 'ds-root-42', root: 'Amyl/o', meaning: 'nişasta' },
                    { id: 'ds-root-43', root: 'Glyc/o', meaning: 'şeker' },
                    { id: 'ds-root-44', root: 'Lip/o', meaning: 'yağ' },
                    { id: 'ds-root-45', root: 'Prote/o', meaning: 'protein' },
                ]
            },
            {
                name: 'Klinik Bulgular ve Çıktılar',
                roots: [
                    { id: 'ds-root-46', root: 'Emet/o', meaning: 'kusma' },
                    { id: 'ds-root-47', root: 'Hemat/o + emesis', meaning: 'kanlı kusma' },
                    { id: 'ds-root-48', root: 'Fec/o', meaning: 'dışkı' },
                    { id: 'ds-root-49', root: 'Melan/o + -emesis', meaning: 'siyah kusma' },
                ]
            },
            {
                name: 'İşlevsel Durumlar ve Mekanizmalar',
                roots: [
                    { id: 'ds-root-50', root: 'Dyspeps/o', meaning: 'hazımsızlık' },
                    { id: 'ds-root-51', root: 'Anorex/o', meaning: 'iştahsızlık' },
                ]
            }
        ]
    },
    {
        system: 'Boşaltım Sistemi',
        subcategories: [
            {
                name: 'Boşaltım Organları ve Yapıları',
                roots: [
                    { id: 'us-root-1', root: 'Nephr/o', meaning: 'böbrek' },
                    { id: 'us-root-2', root: 'Ren/o', meaning: 'böbrek' },
                    { id: 'us-root-3', root: 'Pyel/o', meaning: 'böbrek pelvisi' },
                    { id: 'us-root-4', root: 'Glomerul/o', meaning: 'glomerül (süzgeç)' },
                    { id: 'us-root-5', root: 'Ureter/o', meaning: 'üreter (idrar kanalı)' },
                    { id: 'us-root-6', root: 'Cyst/o', meaning: 'mesane' },
                    { id: 'us-root-7', root: 'Vesic/o', meaning: 'mesane / kese' },
                    { id: 'us-root-8', root: 'Urethr/o', meaning: 'üretra (idrar yolu)' },
                ]
            },
            {
                name: 'İşlev ve Boşaltım Dinamiği',
                roots: [
                    { id: 'us-root-9', root: 'Ur/o', meaning: 'idrar' },
                    { id: 'us-root-10', root: 'Urin/o', meaning: 'idrar' },
                    { id: 'us-root-11', root: 'Micturit/o', meaning: 'işeme' },
                    { id: 'us-root-12', root: 'Diure/o', meaning: 'idrar yapma' },
                ]
            },
            {
                name: 'İdrar Analizi ve Anormal Bulgular',
                roots: [
                    { id: 'us-root-13', root: 'Albumin/o', meaning: 'albumin (protein)' },
                    { id: 'us-root-14', root: 'Glycos/o', meaning: 'şeker' },
                    { id: 'us-root-15', root: 'Hemat/o', meaning: 'kan' },
                    { id: 'us-root-16', root: 'Py/o', meaning: 'irin' },
                    { id: 'us-root-17', root: 'Ket/o', meaning: 'keton' },
                ]
            },
            {
                name: 'Yapısal Bozukluklar ve Oluşumlar',
                roots: [
                    { id: 'us-root-18', root: 'Lith/o', meaning: 'taş' },
                    { id: 'us-root-19', root: 'Calcul/o', meaning: 'taş' },
                    { id: 'us-root-20', root: 'Hydr/o', meaning: 'su / sıvı' },
                    { id: 'us-root-21', root: 'Hydronephr/o', meaning: 'böbrekte su toplanması' },
                ]
            },
            {
                name: 'Klinik Durum / Semptom',
                roots: [
                    { id: 'us-root-22', root: 'Olig/o', meaning: 'az' },
                    { id: 'us-root-23', root: 'Poly-', meaning: 'çok' },
                    { id: 'us-root-24', root: 'An-', meaning: 'yok' },
                    { id: 'us-root-25', root: 'Dys-', meaning: 'güç / ağrılı' },
                    { id: 'us-root-26', root: 'Noct/i', meaning: 'gece' },
                    { id: 'us-root-27', root: 'Enur/o', meaning: 'idrar kaçırma' },
                ]
            },
            {
                name: 'Tedavi Yöntemleri ve Mekanizmaları',
                roots: [
                    { id: 'us-root-28', root: 'Dialys/o', meaning: 'diyaliz / süzme' },
                    { id: 'us-root-29', root: '-lithotripsy', meaning: 'taş kırma' },
                ]
            }
        ]
    },
    {
        system: 'Üreme Sistemi',
        subcategories: [
            {
                name: 'Kadın Üreme Organları',
                roots: [
                    { id: 'rp-root-1', root: 'Gyn/o', meaning: 'kadın' },
                    { id: 'rp-root-2', root: 'Gynec/o', meaning: 'kadın' },
                    { id: 'rp-root-3', root: 'Hyster/o', meaning: 'rahim' },
                    { id: 'rp-root-4', root: 'Uter/o', meaning: 'rahim' },
                    { id: 'rp-root-5', root: 'Metr/o', meaning: 'rahim' },
                    { id: 'rp-root-6', root: 'Cervic/o', meaning: 'rahim ağzı' },
                    { id: 'rp-root-7', root: 'Oophor/o', meaning: 'yumurtalık' },
                    { id: 'rp-root-8', root: 'Ovari/o', meaning: 'yumurtalık' },
                    { id: 'rp-root-9', root: 'Salping/o', meaning: 'yumurta kanalı' },
                    { id: 'rp-root-10', root: 'Colp/o', meaning: 'vajina' },
                    { id: 'rp-root-11', root: 'Vagin/o', meaning: 'vajina' },
                    { id: 'rp-root-12', root: 'Vulv/o', meaning: 'dış genital organ' },
                    { id: 'rp-root-13', root: 'Mamm/o', meaning: 'meme' },
                    { id: 'rp-root-14', root: 'Mast/o', meaning: 'meme' },
                ]
            },
            {
                name: 'Erkek Üreme Organları',
                roots: [
                    { id: 'rp-root-15', root: 'Andr/o', meaning: 'erkek' },
                    { id: 'rp-root-16', root: 'Orchid/o', meaning: 'testis' },
                    { id: 'rp-root-17', root: 'Orchi/o', meaning: 'testis' },
                    { id: 'rp-root-18', root: 'Test/o', meaning: 'testis' },
                    { id: 'rp-root-19', root: 'Epididym/o', meaning: 'epididim' },
                    { id: 'rp-root-20', root: 'Vas/o', meaning: 'kanal (vas deferens)' },
                    { id: 'rp-root-21', root: 'Prostat/o', meaning: 'prostat' },
                    { id: 'rp-root-22', root: 'Balan/o', meaning: 'penis başı' },
                ]
            },
            {
                name: 'Gametler, Salgılar ve Döngüler',
                roots: [
                    { id: 'rp-root-23', root: 'Sperm/o', meaning: 'sperm' },
                    { id: 'rp-root-24', root: 'Spermat/o', meaning: 'sperm' },
                    { id: 'rp-root-25', root: 'Ov/o', meaning: 'yumurta' },
                    { id: 'rp-root-26', root: 'Men/o', meaning: 'adet / ay hali' },
                    { id: 'rp-root-27', root: 'Menstru/o', meaning: 'adet görme' },
                    { id: 'rp-root-28', root: 'Lact/o', meaning: 'süt' },
                    { id: 'rp-root-29', root: 'Galact/o', meaning: 'süt' },
                ]
            },
            {
                name: 'Klinik Durumlar ve İşlev Bozuklukları',
                roots: [
                    { id: 'rp-root-30', root: 'Gravid/o', meaning: 'hamile' },
                    { id: 'rp-root-31', root: 'Para', meaning: 'doğum' },
                    { id: 'rp-root-32', root: 'Nat/o', meaning: 'doğum' },
                    { id: 'rp-root-33', root: 'Amni/o', meaning: 'amnion (su kesesi)' },
                    { id: 'rp-root-34', root: 'Fet/o', meaning: 'fetüs' },
                    { id: 'rp-root-35', root: 'Embry/o', meaning: 'embriyo' },
                ]
            },
            {
                name: 'Tanı, İşlem ve Cerrahi Girişimler',
                roots: [
                    { id: 'rp-root-36', root: 'Colp/o + -scopy', meaning: 'vajina muayenesi' },
                    { id: 'rp-root-37', root: 'Mamm/o + -graphy', meaning: 'meme görüntüleme' },
                    { id: 'rp-root-38', root: 'Hyster/o + -ectomy', meaning: 'rahim alımı' },
                ]
            }
        ]
    },
    {
        system: 'Sinir Sistemi',
        subcategories: [
            {
                name: 'Merkezi ve Çevresel Sinir Yapıları',
                roots: [
                    { id: 'ns-root-1', root: 'Neur/o', meaning: 'sinir' },
                    { id: 'ns-root-2', root: 'Encephal/o', meaning: 'beyin' },
                    { id: 'ns-root-3', root: 'Cerebr/o', meaning: 'beyin (büyük beyin)' },
                    { id: 'ns-root-4', root: 'Cerebell/o', meaning: 'beyincik' },
                    { id: 'ns-root-5', root: 'Myel/o', meaning: 'omurilik' },
                    { id: 'ns-root-6', root: 'Mening/o', meaning: 'beyin zarı' },
                    { id: 'ns-root-7', root: 'Dur/o', meaning: 'sert zar (dura mater)' },
                    { id: 'ns-root-8', root: 'Gangli/o', meaning: 'sinir düğümü' },
                    { id: 'ns-root-9', root: 'Radic/o', meaning: 'sinir kökü' },
                ]
            },
            {
                name: 'Zihinsel Süreçler ve Duyusal İşlevler',
                roots: [
                    { id: 'ns-root-10', root: 'Psych/o', meaning: 'zihin / ruh' },
                    { id: 'ns-root-11', root: 'Ment/o', meaning: 'zihin' },
                    { id: 'ns-root-12', root: 'Phren/o', meaning: 'zihin' },
                    { id: 'ns-root-13', root: 'Cogn/o', meaning: 'bilme / tanıma' },
                    { id: 'ns-root-14', root: 'Esthesi/o', meaning: 'his / duygu' },
                    { id: 'ns-root-15', root: 'Alges/o', meaning: 'ağrı duyusu' },
                    { id: 'ns-root-16', root: 'Phas/o', meaning: 'konuşma' },
                ]
            },
            {
                name: 'Motor (Hareket) ve Otonom İşlevler',
                roots: [
                    { id: 'ns-root-17', root: 'Kines/o', meaning: 'hareket' },
                    { id: 'ns-root-18', root: 'Tax/o', meaning: 'düzen / koordinasyon' },
                    { id: 'ns-root-19', root: 'Ton/o', meaning: 'gerginlik / tonus' },
                    { id: 'ns-root-20', root: 'Sympathet/o', meaning: 'sempatik sinir' },
                    { id: 'ns-root-21', root: 'Parasympathet/o', meaning: 'parasempatik sinir' },
                ]
            },
            {
                name: 'Nörolojik Hastalık Mekanizmaları',
                roots: [
                    { id: 'ns-root-22', root: 'Scler/o', meaning: 'sertleşme' },
                    { id: 'ns-root-23', root: 'Pleg/o', meaning: 'felç' },
                    { id: 'ns-root-24', root: 'Pares/o', meaning: 'kısmi felç' },
                    { id: 'ns-root-25', root: 'Convuls/o', meaning: 'kasılma / nöbet' },
                    { id: 'ns-root-26', root: 'Epileps/o', meaning: 'sara / epilepsi' },
                ]
            },
            {
                name: 'Psikiyatrik Durumlar ve Duygulanım Bozuklukları',
                roots: [
                    { id: 'ns-root-27', root: 'Schiz/o', meaning: 'bölünme' },
                    { id: 'ns-root-28', root: 'Phob/o', meaning: 'korku' },
                    { id: 'ns-root-29', root: 'Phil/o', meaning: 'sevgi / eğilim' },
                    { id: 'ns-root-30', root: '-mania', meaning: 'aşırı tutku' },
                    { id: 'ns-root-31', root: 'Depress/o', meaning: 'depresyon' },
                    { id: 'ns-root-32', root: 'Anxi/o', meaning: 'kaygı / endişe' },
                ]
            },
            {
                name: 'Nörolojik Tanı ve Girişimsel Yöntemler',
                roots: [
                    { id: 'ns-root-33', root: 'Electr/o + encephal/o', meaning: 'beyin elektrik kaydı (EEG)' },
                    { id: 'ns-root-34', root: 'Tom/o', meaning: 'kesit / dilim (tomografi)' },
                    { id: 'ns-root-35', root: 'Radi/o', meaning: 'radyasyon / ışın' },
                ]
            }
        ]
    },
    {
        system: 'Göz',
        subcategories: [
            {
                name: 'Göz Küresi ve Yardımcı Yapılar',
                roots: [
                    { id: 'eye-root-1', root: 'Ophthalm/o', meaning: 'göz' },
                    { id: 'eye-root-2', root: 'Ocul/o', meaning: 'göz' },
                    { id: 'eye-root-3', root: 'Blephar/o', meaning: 'göz kapağı' },
                    { id: 'eye-root-4', root: 'Conjunctiv/o', meaning: 'göz bağlantı zarı' },
                    { id: 'eye-root-5', root: 'Corne/o', meaning: 'kornea (saydam tabaka)' },
                    { id: 'eye-root-6', root: 'Kerat/o', meaning: 'kornea' },
                    { id: 'eye-root-7', root: 'Scler/o', meaning: 'sklera (ak tabaka)' },
                    { id: 'eye-root-8', root: 'Uve/o', meaning: 'üvea (orta tabaka)' },
                    { id: 'eye-root-9', root: 'Ir/o', meaning: 'iris (göz bebeği çevresi)' },
                    { id: 'eye-root-10', root: 'Irid/o', meaning: 'iris' },
                    { id: 'eye-root-11', root: 'Core/o', meaning: 'göz bebeği' },
                    { id: 'eye-root-12', root: 'Pupill/o', meaning: 'göz bebeği' },
                    { id: 'eye-root-13', root: 'Phac/o', meaning: 'lens (mercek)' },
                    { id: 'eye-root-14', root: 'Lent/o', meaning: 'lens' },
                    { id: 'eye-root-15', root: 'Retin/o', meaning: 'retina (ağ tabaka)' },
                    { id: 'eye-root-16', root: 'Vitre/o', meaning: 'camsı cisim' },
                ]
            },
            {
                name: 'Görme İşlevi ve Göz Hareketleri',
                roots: [
                    { id: 'eye-root-17', root: 'Opt/o', meaning: 'görme' },
                    { id: 'eye-root-18', root: 'Vis/o', meaning: 'görme' },
                    { id: 'eye-root-19', root: 'Phot/o', meaning: 'ışık' },
                    { id: 'eye-root-20', root: 'Scot/o', meaning: 'karanlık' },
                    { id: 'eye-root-21', root: 'Nyct/o', meaning: 'gece' },
                    { id: 'eye-root-22', root: 'Dacry/o', meaning: 'gözyaşı' },
                    { id: 'eye-root-23', root: 'Lacrim/o', meaning: 'gözyaşı' },
                ]
            },
            {
                name: 'Görme Kaybı ve Göz Hastalıkları',
                roots: [
                    { id: 'eye-root-24', root: 'Ambly/o', meaning: 'donuk / zayıf görme' },
                    { id: 'eye-root-25', root: 'Dipl/o', meaning: 'çift görme' },
                    { id: 'eye-root-26', root: 'Presby/o', meaning: 'yaşlılık' },
                    { id: 'eye-root-27', root: 'Myop/o', meaning: 'miyop / yakını görme' },
                    { id: 'eye-root-28', root: 'Hyperop/o', meaning: 'hipermetrop / uzağı görme' },
                    { id: 'eye-root-29', root: 'Glauc/o', meaning: 'glokom / göz tansiyonu' },
                    { id: 'eye-root-30', root: 'Cataract/o', meaning: 'katarakt / gözde perde' },
                ]
            },
            {
                name: 'Göz Muayenesi ve Cerrahi İşlemler',
                roots: [
                    { id: 'eye-root-31', root: '-scopy', meaning: 'bakma / muayene' },
                    { id: 'eye-root-32', root: '-metry', meaning: 'ölçme' },
                    { id: 'eye-root-33', root: 'Ton/o', meaning: 'basınç / tansiyon' },
                ]
            }
        ]
    },
    {
        system: 'Kulak',
        subcategories: [
            {
                name: 'Kulak Yapıları ve İşitme Yolu',
                roots: [
                    { id: 'ear-root-1', root: 'Ot/o', meaning: 'kulak' },
                    { id: 'ear-root-2', root: 'Aur/o', meaning: 'kulak' },
                    { id: 'ear-root-3', root: 'Auricul/o', meaning: 'kulak kepçesi' },
                    { id: 'ear-root-4', root: 'Tympan/o', meaning: 'kulak zarı / orta kulak' },
                    { id: 'ear-root-5', root: 'Myring/o', meaning: 'kulak zarı' },
                    { id: 'ear-root-6', root: 'Ossi/o', meaning: 'kemikçik' },
                    { id: 'ear-root-7', root: 'Malle/o', meaning: 'çekiç kemiği' },
                    { id: 'ear-root-8', root: 'Incud/o', meaning: 'örs kemiği' },
                    { id: 'ear-root-9', root: 'Staped/o', meaning: 'üzengi kemiği' },
                    { id: 'ear-root-10', root: 'Cochle/o', meaning: 'koklea (salyangoz)' },
                    { id: 'ear-root-11', root: 'Vestibul/o', meaning: 'vestibül (denge organı)' },
                    { id: 'ear-root-12', root: 'Salping/o', meaning: 'östaki borusu' },
                ]
            },
            {
                name: 'İşitme, Denge ve Ses İletimi',
                roots: [
                    { id: 'ear-root-13', root: 'Audi/o', meaning: 'işitme' },
                    { id: 'ear-root-14', root: 'Acous/o', meaning: 'ses / işitme' },
                    { id: 'ear-root-15', root: 'Son/o', meaning: 'ses' },
                    { id: 'ear-root-16', root: 'Phon/o', meaning: 'ses' },
                    { id: 'ear-root-17', root: 'Equili br/o', meaning: 'denge' },
                ]
            },
            {
                name: 'İşitme Kaybı ve Kulak Hastalıkları',
                roots: [
                    { id: 'ear-root-18', root: 'Presby-', meaning: 'yaşlılık' },
                    { id: 'ear-root-19', root: 'Ot/o + -itis', meaning: 'kulak iltihabı' },
                    { id: 'ear-root-20', root: 'Labyrinth/o', meaning: 'labirent (iç kulak)' },
                    { id: 'ear-root-21', root: 'Vertig/o', meaning: 'baş dönmesi' },
                ]
            },
            {
                name: 'Kulak Muayenesi ve Cerrahi İşlemler',
                roots: [
                    { id: 'ear-root-22', root: '-scopy', meaning: 'bakma / muayene' },
                    { id: 'ear-root-23', root: '-metry', meaning: 'ölçme' },
                    { id: 'ear-root-24', root: 'Tympan/o + -plasty', meaning: 'kulak zarı onarımı' },
                ]
            }
        ]
    },
    {
        system: 'Deri',
        subcategories: [
            {
                name: 'Deri, Ekleri ve Lezyon Tipleri',
                roots: [
                    { id: 'skin-root-1', root: 'Dermat/o', meaning: 'deri' },
                    { id: 'skin-root-2', root: 'Derm/o', meaning: 'deri' },
                    { id: 'skin-root-3', root: 'Cutane/o', meaning: 'deri' },
                    { id: 'skin-root-4', root: 'Epiderm/o', meaning: 'üst deri' },
                    { id: 'skin-root-5', root: 'Trich/o', meaning: 'saç / kıl' },
                    { id: 'skin-root-6', root: 'Pil/o', meaning: 'kıl' },
                    { id: 'skin-root-7', root: 'Onych/o', meaning: 'tırnak' },
                    { id: 'skin-root-8', root: 'Ungu/o', meaning: 'tırnak' },
                    { id: 'skin-root-9', root: 'Seb/o', meaning: 'yağ (sebum)' },
                    { id: 'skin-root-10', root: 'Adip/o', meaning: 'yağ' },
                    { id: 'skin-root-11', root: 'Lip/o', meaning: 'yağ' },
                    { id: 'skin-root-12', root: 'Hidr/o', meaning: 'ter' },
                    { id: 'skin-root-13', root: 'Sudor/o', meaning: 'ter' },
                ]
            },
            {
                name: 'Deri İşlevleri ve Fizyolojisi',
                roots: [
                    { id: 'skin-root-14', root: 'Melan/o', meaning: 'melanin / pigment' },
                    { id: 'skin-root-15', root: 'Kerat/o', meaning: 'keratin / sert doku' },
                    { id: 'skin-root-16', root: 'Collagen/o', meaning: 'kolajen' },
                ]
            },
            {
                name: 'Deri Hastalıkları ve Patolojik Süreçler',
                roots: [
                    { id: 'skin-root-17', root: 'Xer/o', meaning: 'kuru' },
                    { id: 'skin-root-18', root: 'Ichthy/o', meaning: 'balık pulu gibi' },
                    { id: 'skin-root-19', root: 'Erythem/o', meaning: 'kızarıklık' },
                    { id: 'skin-root-20', root: 'Cyan/o', meaning: 'morarma / mavi' },
                    { id: 'skin-root-21', root: 'Leuc/o', meaning: 'beyaz' },
                    { id: 'skin-root-22', root: 'Xanth/o', meaning: 'sarı' },
                    { id: 'skin-root-23', root: 'Myc/o', meaning: 'mantar' },
                    { id: 'skin-root-24', root: 'Pedicul/o', meaning: 'bit' },
                    { id: 'skin-root-25', root: 'Scab/o', meaning: 'uyuz' },
                ]
            },
            {
                name: 'Dermatolojik Tanı ve Tedavi Yöntemleri',
                roots: [
                    { id: 'skin-root-26', root: 'Bi/o + -psy', meaning: 'doku örneği alma' },
                    { id: 'skin-root-27', root: 'Cry/o', meaning: 'soğuk / dondurma tedavisi' },
                    { id: 'skin-root-28', root: 'Caut/o', meaning: 'yakma / koterizasyon' },
                ]
            }
        ]
    },
    {
        system: 'Koku',
        subcategories: [
            {
                name: 'Koku ve Tat Alma Yapıları',
                roots: [
                    { id: 'smell-root-1', root: 'Olfact/o', meaning: 'koku alma' },
                    { id: 'smell-root-2', root: 'Osm/o', meaning: 'koku' },
                    { id: 'smell-root-3', root: 'Nas/o', meaning: 'burun' },
                    { id: 'smell-root-4', root: 'Gust/o', meaning: 'tat alma' },
                    { id: 'smell-root-5', root: 'Lingu/o', meaning: 'dil' },
                ]
            },
            {
                name: 'Koku ve Tat Algısı',
                roots: [
                    { id: 'smell-root-6', root: 'Sens/o', meaning: 'duyum / his' },
                    { id: 'smell-root-7', root: 'Percept/o', meaning: 'algılama' },
                ]
            },
            {
                name: 'Koku ve Tat Bozuklukları',
                roots: [
                    { id: 'smell-root-8', root: 'An-', meaning: 'yok / eksik' },
                    { id: 'smell-root-9', root: 'Hypo-', meaning: 'azalmış' },
                    { id: 'smell-root-10', root: 'Hyper-', meaning: 'artmış' },
                    { id: 'smell-root-11', root: 'Dys-', meaning: 'bozuk' },
                    { id: 'smell-root-12', root: 'Paros/o', meaning: 'koku alma bozukluğu' },
                    { id: 'smell-root-13', root: 'Ageus/o', meaning: 'tat alma kaybı' },
                ]
            }
        ]
    },
    {
        system: 'Endokrin Sistem',
        subcategories: [
            {
                name: 'Endokrin Bezler ve Organlar',
                roots: [
                    { id: 'endo-root-1', root: 'Aden/o', meaning: 'bez' },
                    { id: 'endo-root-2', root: 'Hypophys/o', meaning: 'hipofiz bezi' },
                    { id: 'endo-root-3', root: 'Pituitar/o', meaning: 'hipofiz' },
                    { id: 'endo-root-4', root: 'Pineal/o', meaning: 'epifiz bezi' },
                    { id: 'endo-root-5', root: 'Thyroid/o', meaning: 'tiroid bezi' },
                    { id: 'endo-root-6', root: 'Thyr/o', meaning: 'tiroid' },
                    { id: 'endo-root-7', root: 'Parathyroid/o', meaning: 'paratiroid bezi' },
                    { id: 'endo-root-8', root: 'Thym/o', meaning: 'timus bezi' },
                    { id: 'endo-root-9', root: 'Adren/o', meaning: 'böbrek üstü bezi' },
                    { id: 'endo-root-10', root: 'Adrenal/o', meaning: 'böbrek üstü bezi' },
                    { id: 'endo-root-11', root: 'Pancreat/o', meaning: 'pankreas' },
                    { id: 'endo-root-12', root: 'Gonad/o', meaning: 'cinsiyet bezi' },
                ]
            },
            {
                name: 'Hormonlar ve Metabolik Kontroller',
                roots: [
                    { id: 'endo-root-13', root: 'Hormon/o', meaning: 'hormon' },
                    { id: 'endo-root-14', root: 'Crin/o', meaning: 'salgılama' },
                    { id: 'endo-root-15', root: 'Glyc/o', meaning: 'şeker / glikoz' },
                    { id: 'endo-root-16', root: 'Gluc/o', meaning: 'şeker' },
                    { id: 'endo-root-17', root: 'Insul/o', meaning: 'insülin' },
                    { id: 'endo-root-18', root: 'Calc/o', meaning: 'kalsiyum' },
                    { id: 'endo-root-19', root: 'Kal/i', meaning: 'potasyum' },
                    { id: 'endo-root-20', root: 'Natr/o', meaning: 'sodyum' },
                    { id: 'endo-root-21', root: 'Metabol/o', meaning: 'metabolizma' },
                ]
            },
            {
                name: 'Endokrin Bozuklukların Klinik Görünümleri',
                roots: [
                    { id: 'endo-root-22', root: 'Hyper-', meaning: 'fazla / artmış' },
                    { id: 'endo-root-23', root: 'Hypo-', meaning: 'az / azalmış' },
                    { id: 'endo-root-24', root: 'Toxic/o', meaning: 'zehirli / toksik' },
                    { id: 'endo-root-25', root: 'Goiter/o', meaning: 'guatr / tiroid büyümesi' },
                    { id: 'endo-root-26', root: 'Diabet/o', meaning: 'diyabet / şeker hastalığı' },
                ]
            }
        ]
    }
];

// Helper function to get all systems
export const getSystems = () => {
    return medicalRoots.map(item => item.system);
};

// Helper function to get subcategories for a system
export const getSubcategories = (systemName) => {
    const system = medicalRoots.find(item => item.system === systemName);
    return system ? system.subcategories : [];
};

// Helper function to search roots
export const searchRoots = (query) => {
    const results = [];
    const lowerQuery = query.toLowerCase();

    medicalRoots.forEach(system => {
        system.subcategories.forEach(subcategory => {
            const matchingRoots = subcategory.roots.filter(root =>
                root.root.toLowerCase().includes(lowerQuery) ||
                root.meaning.toLowerCase().includes(lowerQuery)
            );

            if (matchingRoots.length > 0) {
                results.push({
                    system: system.system,
                    subcategory: subcategory.name,
                    roots: matchingRoots
                });
            }
        });
    });

    return results;
};

// Helper function to get total root count
export const getTotalRootCount = () => {
    return medicalRoots.reduce((total, system) => {
        return total + system.subcategories.reduce((subTotal, subcategory) => {
            return subTotal + subcategory.roots.length;
        }, 0);
    }, 0);
};
