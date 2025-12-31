// Medical Terminology Data - Extracted from PDFs

export const categories = [
  { id: 'anatomy', name: 'Anatomik Terimler', icon: 'Bone', color: 'primary' },
  { id: 'surgery', name: 'Ameliyat Terimleri', icon: 'Scissors', color: 'secondary' },
  { id: 'roots', name: 'Kökler ve Ekler', icon: 'BookOpen', color: 'accent' },
  { id: 'pathology', name: 'Semptomlar ve Patoloji', icon: 'Activity', color: 'success' }
];

export const medicalTermsData = {
  anatomy: [
    { id: 1, term: 'Abductor', turkish: 'Uzaklaştırıcı Kas', roots: 'ab- (uzak) + ducere (götürmek)', definition: 'Vücut parçasını orta hattan uzaklaştıran kas', category: 'anatomy' },
    { id: 2, term: 'Acetabular', turkish: 'Asetabular, Kalça Yuvası', roots: 'acetabulum (küçük kase)', definition: 'Kalça kemiğinde femur başını alan yuva ile ilgili', category: 'anatomy' },
    { id: 3, term: 'Acromioclavicular', turkish: 'Akromiyoklaviküler', roots: 'acromion (omuz ucu) + clavicula (köprücük kemiği)', definition: 'Kürek kemiği çıkıntısı ile köprücük kemiği arasındaki eklem', category: 'anatomy' },
    { id: 4, term: 'Adductor', turkish: 'Yaklaştırıcı Kas', roots: 'ad- (yakın) + ducere (götürmek)', definition: 'Vücut parçasını orta hatta yaklaştıran kas', category: 'anatomy' },
    { id: 5, term: 'Articular Cartilage', turkish: 'Eklem Kıkırdağı', roots: 'articularis (eklem) + cartilago (kıkırdak)', definition: 'Kemiklerin eklem yüzeylerini kaplayan düz doku', category: 'anatomy' },
    { id: 6, term: 'Brachial', turkish: 'Brakial, Kol Kemiğine Ait', roots: 'brachium (kol)', definition: 'Omuz ile dirsek arasındaki üst kol bölgesi', category: 'anatomy' },
    { id: 7, term: 'Calcaneal', turkish: 'Kalkaneal, Topuk Kemiğine Ait', roots: 'calcaneus (topuk kemiği)', definition: 'Ayaktaki topuk kemiği ile ilgili', category: 'anatomy' },
    { id: 8, term: 'Carpal', turkish: 'Karpal, El Bileği Kemiğine Ait', roots: 'carpos (bilek)', definition: 'El bileğindeki kemikler ile ilgili', category: 'anatomy' },
    { id: 9, term: 'Cervical', turkish: 'Servikal, Boyun Omurlarına Ait', roots: 'cervix (boyun)', definition: 'Boyun bölgesi omurları ile ilgili', category: 'anatomy' },
    { id: 10, term: 'Chondrocyte', turkish: 'Kondrosit, Kıkırdak Hücresi', roots: 'chondros (kıkırdak) + kytos (hücre)', definition: 'Kıkırdak dokusunda bulunan olgun hücre', category: 'anatomy' },
    { id: 11, term: 'Clavicular', turkish: 'Klavikular, Köprücük Kemiğine Ait', roots: 'clavicula (köprücük kemiği)', definition: 'Köprücük kemiği ile ilgili', category: 'anatomy' },
    { id: 12, term: 'Coccygeal', turkish: 'Kokigeal, Kuyruk Sokumu Kemiğine Ait', roots: 'coccyx (kuyruk sokumu)', definition: 'Omurganın tabanındaki kuyruk sokumu kemiği', category: 'anatomy' },
    { id: 13, term: 'Costal', turkish: 'Kostal, Kaburgaya Ait', roots: 'costa (kaburga)', definition: 'Kaburgalar ile ilgili', category: 'anatomy' },
    { id: 14, term: 'Femoral', turkish: 'Femoral, Uyluk Kemiğine Ait', roots: 'femur (uyluk kemiği)', definition: 'Uyluk kemiği ile ilgili', category: 'anatomy' },
    { id: 15, term: 'Fibular', turkish: 'Fibular, Baldır Kemiğine Ait', roots: 'fibula (baldır kemiği)', definition: 'Alt bacaktaki ince kemik ile ilgili', category: 'anatomy' },
    { id: 16, term: 'Humeral', turkish: 'Humerus, Kol Kemiğine Ait', roots: 'humerus (üst kol kemiği)', definition: 'Üst kol kemiği ile ilgili', category: 'anatomy' },
    { id: 17, term: 'Lumbar', turkish: 'Lomber, Bel Omurlarına Ait', roots: 'lumbus (bel)', definition: 'Alt sırt bölgesi omurları ile ilgili', category: 'anatomy' },
    { id: 18, term: 'Patellar', turkish: 'Patelar, Diz Kapağı Kemiğine Ait', roots: 'patella (diz kapağı)', definition: 'Diz kapağı ile ilgili', category: 'anatomy' },
    { id: 19, term: 'Thoracic', turkish: 'Torasik, Göğüs Kafesine Ait', roots: 'thorax (göğüs)', definition: 'Göğüs bölgesi omurları ile ilgili', category: 'anatomy' },
    { id: 20, term: 'Vertebral', turkish: 'Vertebral, Omurlara Ait', roots: 'vertebra (omur)', definition: 'Omurga kemikleri ile ilgili', category: 'anatomy' }
  ],
  surgery: [
    { id: 21, term: 'Arthrodesis', turkish: 'Eklem Dondurma', roots: 'arthr- (eklem) + -desis (birleştirme)', definition: 'Bir eklemde iki veya daha fazla kemiği kaynaştırma ameliyatı', category: 'surgery' },
    { id: 22, term: 'Arthroplasty', turkish: 'Eklem Plastisi/Onarımı', roots: 'arthr- (eklem) + -plasty (şekillendirme)', definition: 'Eklemin cerrahi olarak onarımı veya değiştirilmesi', category: 'surgery' },
    { id: 23, term: 'Arthrotomy', turkish: 'Eklem Açılması', roots: 'arthr- (eklem) + -tomy (kesme)', definition: 'Ekleme cerrahi kesi yapılması', category: 'surgery' },
    { id: 24, term: 'Bursectomy', turkish: 'Bursektomi/Kavuk Çıkarma', roots: 'burs- (kese) + -ectomy (çıkarma)', definition: 'Bursa kesesinin cerrahi olarak çıkarılması', category: 'surgery' },
    { id: 25, term: 'Carpectomy', turkish: 'Karpal Kemiklerin Çıkarılması', roots: 'carp- (bilek) + -ectomy (çıkarma)', definition: 'Bir veya daha fazla el bilek kemiğinin çıkarılması', category: 'surgery' },
    { id: 26, term: 'Cranioplasty', turkish: 'Kafa Plastisi/Onarımı', roots: 'crani- (kafatası) + -plasty (şekillendirme)', definition: 'Kafatasındaki kusurların cerrahi onarımı', category: 'surgery' },
    { id: 27, term: 'Craniotomy', turkish: 'Kafa Açılması', roots: 'crani- (kafatası) + -tomy (kesme)', definition: 'Beyne ulaşmak için kafatasına cerrahi kesi', category: 'surgery' },
    { id: 28, term: 'Fasciectomy', turkish: 'Fasiya Çıkarma', roots: 'fasci- (bağ) + -ectomy (çıkarma)', definition: 'Fasyaın cerrahi olarak çıkarılması', category: 'surgery' },
    { id: 29, term: 'Fasciorraphy', turkish: 'Fasiya Dikimi', roots: 'fasci- (bağ) + -rrhaphy (dikme)', definition: 'Fasyaın cerrahi olarak dikilmesi', category: 'surgery' },
    { id: 30, term: 'Osteoclasis', turkish: 'Kemiğin Kırılması (Cerrahi)', roots: 'oste- (kemik) + -clasis (kırma)', definition: 'Kemiğin cerrahi olarak yeniden kırılması', category: 'surgery' },
    { id: 31, term: 'Patellapexy', turkish: 'Diz Kapağının Sabitlenmesi', roots: 'patella- (diz kapağı) + -pexy (sabitleme)', definition: 'Diz kapağının cerrahi olarak sabitlenmesi', category: 'surgery' },
    { id: 32, term: 'Synovectomy', turkish: 'Sinoviyal Zar Çıkarma', roots: 'synovi- (eklem zarı) + -ectomy (çıkarma)', definition: 'Eklemi döşeyen sinoviyal zarın çıkarılması', category: 'surgery' },
    { id: 33, term: 'Tenodesis', turkish: 'Tendon Dikimi/Sabitleme', roots: 'ten- (tendon) + -odesis (birleştirme)', definition: 'Tendonun kemiğe cerrahi olarak tutturulması', category: 'surgery' },
    { id: 34, term: 'Tenotomy', turkish: 'Tendon Kesilmesi', roots: 'ten- (tendon) + -tomy (kesme)', definition: 'Tendonun cerrahi olarak kesilmesi veya uzatılması', category: 'surgery' }
  ],
  roots: [
    { id: 35, term: 'Arthr/o', turkish: 'Eklem', roots: 'arthr/o', definition: 'Eklem anlamına gelen kök. Örnek: Arthritis (eklem iltihabı)', category: 'roots' },
    { id: 36, term: 'Oste/o', turkish: 'Kemik', roots: 'oste/o', definition: 'Kemik anlamına gelen kök. Örnek: Osteoporosis (kemik erimesi)', category: 'roots' },
    { id: 37, term: 'My/o', turkish: 'Kas', roots: 'my/o', definition: 'Kas anlamına gelen kök. Örnek: Myalgia (kas ağrısı)', category: 'roots' },
    { id: 38, term: 'Chondr/o', turkish: 'Kıkırdak', roots: 'chondr/o', definition: 'Kıkırdak anlamına gelen kök. Örnek: Chondroma (kıkırdak tümörü)', category: 'roots' },
    { id: 39, term: '-itis', turkish: 'İltihap', roots: '-itis', definition: 'İltihap anlamına gelen sonek. Örnek: Arthritis (eklem iltihabı)', category: 'roots' },
    { id: 40, term: '-ectomy', turkish: 'Çıkarma', roots: '-ectomy', definition: 'Cerrahi çıkarma anlamına gelen sonek. Örnek: Bursectomy', category: 'roots' },
    { id: 41, term: '-plasty', turkish: 'Onarım/Şekillendirme', roots: '-plasty', definition: 'Cerrahi onarım anlamına gelen sonek. Örnek: Arthroplasty', category: 'roots' },
    { id: 42, term: '-tomy', turkish: 'Kesme', roots: '-tomy', definition: 'Cerrahi kesme anlamına gelen sonek. Örnek: Craniotomy', category: 'roots' },
    { id: 43, term: '-algia', turkish: 'Ağrı', roots: '-algia', definition: 'Ağrı anlamına gelen sonek. Örnek: Myalgia (kas ağrısı)', category: 'roots' },
    { id: 44, term: 'Crani/o', turkish: 'Kafatası', roots: 'crani/o', definition: 'Kafatası anlamına gelen kök. Örnek: Craniotomy', category: 'roots' },
    { id: 45, term: 'Cervic/o', turkish: 'Boyun', roots: 'cervic/o', definition: 'Boyun anlamına gelen kök. Örnek: Cervical', category: 'roots' },
    { id: 46, term: 'Lumb/o', turkish: 'Bel', roots: 'lumb/o', definition: 'Bel bölgesi anlamına gelen kök. Örnek: Lumbar', category: 'roots' },
    { id: 47, term: 'Cost/o', turkish: 'Kaburga', roots: 'cost/o', definition: 'Kaburga anlamına gelen kök. Örnek: Costal', category: 'roots' },
    { id: 48, term: 'Carp/o', turkish: 'Bilek', roots: 'carp/o', definition: 'El bileği kemikleri anlamına gelen kök. Örnek: Carpal', category: 'roots' }
  ],
  pathology: [
    { id: 49, term: 'Arthralgia', turkish: 'Artralji (Eklem ağrısı)', roots: 'arthron (eklem) + -algia (ağrı)', definition: 'Bir veya daha fazla eklemde ağrı', category: 'pathology' },
    { id: 50, term: 'Arthritis', turkish: 'Artrit (Eklem iltihabı)', roots: 'arthron (eklem) + -itis (iltihap)', definition: 'Bir veya daha fazla eklemin iltihaplanması', category: 'pathology' },
    { id: 51, term: 'Osteoporosis', turkish: 'Osteoporoz (Kemik erimesi)', roots: 'osteon (kemik) + poros (delik) + -osis (durum)', definition: 'Kemiklerin zayıf ve kırılgan hale gelmesi', category: 'pathology' },
    { id: 52, term: 'Osteomyelitis', turkish: 'Osteomiyelit (Kemik iltihabı)', roots: 'osteon (kemik) + myelos (ilik) + -itis (iltihap)', definition: 'Kemiğin iltihaplanması, genellikle bakteriyel enfeksiyon', category: 'pathology' },
    { id: 53, term: 'Myalgia', turkish: 'Miyalji (Kas ağrısı)', roots: 'mys (kas) + -algia (ağrı)', definition: 'Kas ağrısı veya sancısı', category: 'pathology' },
    { id: 54, term: 'Myositis', turkish: 'Miyozit (Kas iltihabı)', roots: 'mys (kas) + -itis (iltihap)', definition: 'Kasların iltihaplanması', category: 'pathology' },
    { id: 55, term: 'Bursitis', turkish: 'Bursit (Bursa iltihabı)', roots: 'bursa (kese) + -itis (iltihap)', definition: 'Bursa kesesinin iltihaplanması', category: 'pathology' },
    { id: 56, term: 'Tendinitis', turkish: 'Tendinit (Tendon iltihabı)', roots: 'tendon (tendon) + -itis (iltihap)', definition: 'Tendonun iltihaplanması', category: 'pathology' },
    { id: 57, term: 'Scoliosis', turkish: 'Skolyoz (Omurganın yana eğriliği)', roots: 'skoliosis (eğri)', definition: 'Omurganın yana doğru eğriliği', category: 'pathology' },
    { id: 58, term: 'Kyphosis', turkish: 'Kifoz (Sırt kamburluğu)', roots: 'kyphos (eğri)', definition: 'Omurganın anormal dışa doğru eğriliği', category: 'pathology' },
    { id: 59, term: 'Lordosis', turkish: 'Lordoz (Bel çukurunun artması)', roots: 'lordos (geriye eğilmiş)', definition: 'Omurganın anormal içe doğru eğriliği', category: 'pathology' },
    { id: 60, term: 'Chondromalacia', turkish: 'Kondromalazi (Kıkırdak yumuşaması)', roots: 'chondros (kıkırdak) + malakia (yumuşaklık)', definition: 'Kıkırdağın yumuşaması veya dejenerasyonu', category: 'pathology' },
    { id: 61, term: 'Osteoma', turkish: 'Osteom (Kemik tümörü)', roots: 'osteon (kemik) + -oma (tümör)', definition: 'İyi huylu kemik tümörü', category: 'pathology' },
    { id: 62, term: 'Osteosarcoma', turkish: 'Osteosarkom (Kemik kanseri)', roots: 'osteon (kemik) + sarcoma (et tümörü)', definition: 'Kötü huylu kemik tümörü', category: 'pathology' },
    { id: 63, term: 'Fibromyalgia', turkish: 'Fibromiyalji (Yaygın kas ağrısı)', roots: 'fibra (lif) + mys (kas) + -algia (ağrı)', definition: 'Yaygın kas-iskelet sistemi ağrısı', category: 'pathology' },
    { id: 64, term: 'Atrophy', turkish: 'Atrofi (Kas erimesi)', roots: 'a- (yok) + trophē (beslenme)', definition: 'Kas veya dokunun küçülmesi', category: 'pathology' }
  ]
};

// Get all terms as a flat array
export const getAllTerms = () => {
  return Object.values(medicalTermsData).flat();
};

// Get terms by category
export const getTermsByCategory = (categoryId) => {
  return medicalTermsData[categoryId] || [];
};

// Get random terms for games
export const getRandomTerms = (count = 10, categoryId = null) => {
  const terms = categoryId ? getTermsByCategory(categoryId) : getAllTerms();
  const shuffled = [...terms].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Search terms
export const searchTerms = (query) => {
  const allTerms = getAllTerms();
  const lowerQuery = query.toLowerCase();
  return allTerms.filter(term => 
    term.term.toLowerCase().includes(lowerQuery) ||
    term.turkish.toLowerCase().includes(lowerQuery) ||
    term.definition.toLowerCase().includes(lowerQuery)
  );
};