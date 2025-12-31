import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, RotateCw, Check, X, BookOpen, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { medicalTerms } from '../data/medicalData'; // Yeni veritabanı
import { saveFlashcardSession } from '../utils/storage';

export const Flashcards = () => {
  // --- STATE ---
  const [selectedSystem, setSelectedSystem] = useState(null); // Seçilen sistem
  const [studyDeck, setStudyDeck] = useState([]); // Çalışılacak kart destesi
  const [currentIndex, setCurrentIndex] = useState(0); // Şu anki kart sırası
  const [isFlipped, setIsFlipped] = useState(false); // Kart dönük mü?
  const [direction, setDirection] = useState(0); // Animasyon yönü (sağ/sol)
  const [knownCount, setKnownCount] = useState(0); // Bilinen kart sayısı
  const [isSessionComplete, setIsSessionComplete] = useState(false); // Oturum bitti mi?

  // --- SİSTEMLERİ ÇEK ---
  const systems = ['Karışık (Tüm Sistemler)', ...new Set(medicalTerms.map(t => t.system))];

  // --- OTURUM BAŞLAT ---
  const startSession = (system) => {
    let pool = [];
    if (system === 'Karışık (Tüm Sistemler)') {
      pool = medicalTerms;
    } else {
      pool = medicalTerms.filter(t => t.system === system);
    }

    // Karıştır ve ilk 20 kartı al (çok uzun olmasın diye)
    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 20);

    if (shuffled.length === 0) {
      toast.error("Bu sistemde henüz terim yok.");
      return;
    }

    setStudyDeck(shuffled);
    setSelectedSystem(system);
    setCurrentIndex(0);
    setKnownCount(0);
    setIsFlipped(false);
    setIsSessionComplete(false);
  };

  // --- KART ÇEVİR ---
  const handleFlip = () => setIsFlipped(!isFlipped);

  // --- SONRAKİ KART ---
  const handleNext = (known) => {
    if (known) {
      setKnownCount(prev => prev + 1);
      toast.success("Süper! Öğrenildi.", { duration: 1000 });
    }

    setDirection(known ? 1 : -1);
    setIsFlipped(false);

    setTimeout(() => {
      if (currentIndex + 1 < studyDeck.length) {
        setCurrentIndex(prev => prev + 1);
      } else {
        finishSession(known ? knownCount + 1 : knownCount);
      }
    }, 200);
  };

  // --- OTURUM BİTİR ---
  const finishSession = (finalKnownCount) => {
    setIsSessionComplete(true);
    saveFlashcardSession(selectedSystem, finalKnownCount, studyDeck.length); // XP Kaydet

    if (finalKnownCount > 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  // ---------------- ARAYÜZ (UI) ----------------

  // 1. SİSTEM SEÇİM EKRANI
  if (!selectedSystem) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex p-3 bg-blue-100 rounded-full mb-2">
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Flashcard Çalışması
          </h1>
          <p className="text-muted-foreground">Hangi sistemdeki terimleri çalışmak istersin?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {systems.map((system) => (
            <Card
              key={system}
              className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-blue-500 group flex items-center justify-between"
              onClick={() => startSession(system)}
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-secondary/20 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <Brain className="w-5 h-5 text-primary group-hover:text-blue-600" />
                </div>
                <span className="font-semibold">{system}</span>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-blue-600 group-hover:translate-x-1 transition-transform" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // 2. OTURUM SONU EKRANI
  if (isSessionComplete) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-primary">Çalışma Tamamlandı!</h2>

          <div className="space-y-2">
            <p className="text-muted-foreground">Bu oturumda öğrendiğin terim sayısı:</p>
            <div className="text-4xl font-bold text-green-600">{knownCount} / {studyDeck.length}</div>
          </div>

          <Progress value={(knownCount / studyDeck.length) * 100} className="h-3" />

          <div className="grid grid-cols-2 gap-4 pt-4">
            <Button variant="outline" onClick={() => setSelectedSystem(null)}>
              Farklı Sistem
            </Button>
            <Button className="gradient-primary" onClick={() => startSession(selectedSystem)}>
              Tekrar Çalış
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // 3. KART GÖSTERİM EKRANI
  const currentCard = studyDeck[currentIndex];

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 min-h-[80vh] flex flex-col">
      {/* Üst Bar */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setSelectedSystem(null)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Sistemler
        </Button>
        <span className="font-semibold text-primary">{selectedSystem}</span>
        <div className="text-sm font-mono text-muted-foreground">
          {currentIndex + 1} / {studyDeck.length}
        </div>
      </div>

      <Progress value={((currentIndex) / studyDeck.length) * 100} className="h-2" />

      {/* Kart Alanı */}
      <div className="flex-1 flex items-center justify-center perspective-1000 py-8">
        <motion.div
          className="w-full max-w-md aspect-[4/3] relative cursor-pointer"
          onClick={handleFlip}
          initial={{ opacity: 0, x: 50 * direction }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 * direction }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="w-full h-full absolute inset-0 preserve-3d transition-all duration-500 rounded-2xl shadow-xl border-2 border-border/50 bg-card"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* ÖN YÜZ (TERİM) */}
            <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl">
              <span className="text-sm font-medium text-blue-500 mb-4 uppercase tracking-wider">Terim</span>
              <h3 className="text-4xl md:text-5xl font-bold text-center text-primary">
                {currentCard?.term}
              </h3>
              <p className="mt-8 text-sm text-muted-foreground flex items-center gap-2">
                <RotateCw className="w-4 h-4" /> Cevabı görmek için tıkla
              </p>
            </div>

            {/* ARKA YÜZ (ANLAM) */}
            <div
              className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl"
              style={{ transform: 'rotateY(180deg)' }}
            >
              <span className="text-sm font-medium text-blue-100 mb-4 uppercase tracking-wider">Anlamı</span>
              <h3 className="text-3xl md:text-4xl font-bold text-center leading-relaxed">
                {currentCard?.meaning}
              </h3>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Kontrol Butonları */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          size="lg"
          className="border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
          onClick={(e) => { e.stopPropagation(); handleNext(false); }}
        >
          <X className="w-5 h-5 mr-2" /> Bilmiyorum
        </Button>

        <Button
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white shadow-green-200"
          onClick={(e) => { e.stopPropagation(); handleNext(true); }}
        >
          <Check className="w-5 h-5 mr-2" /> Biliyorum
        </Button>
      </div>
    </div>
  );
};