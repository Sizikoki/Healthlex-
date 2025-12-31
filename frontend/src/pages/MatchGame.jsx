import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, RefreshCw, Trophy, ArrowLeft, Brain } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { medicalTerms } from '../data/medicalData';
import { saveMatchScore } from '../utils/storage';

// --- Basit UI Bileşenleri (Ayar gerektirmez) ---
const SimpleButton = ({ children, onClick, variant = 'primary', className = '' }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
  };
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const SimpleCard = ({ children, className = '', onClick }) => (
  <div onClick={onClick} className={`bg-white rounded-xl shadow-md border border-gray-200 ${className}`}>
    {children}
  </div>
);

export const MatchGame = () => {
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Sistemleri çek
  const systems = ['Karışık (Tüm Sistemler)', ...new Set(medicalTerms.map(t => t.system))];

  // Sayaç
  useEffect(() => {
    let interval;
    if (isPlaying && !gameOver) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, gameOver]);

  // Oyunu Başlat
  const initializeGame = (system) => {
    let pool = system === 'Karışık (Tüm Sistemler)'
      ? medicalTerms
      : medicalTerms.filter(t => t.system === system);

    if (pool.length < 6) pool = medicalTerms;

    const selectedTerms = [...pool].sort(() => 0.5 - Math.random()).slice(0, 6);

    const gameCards = selectedTerms.flatMap(term => [
      { id: `${term.id}-term`, pairId: term.id, content: term.term, type: 'term', isFlipped: false },
      { id: `${term.id}-meaning`, pairId: term.id, content: term.meaning, type: 'meaning', isFlipped: false }
    ]);

    setCards(gameCards.sort(() => 0.5 - Math.random()));
    setSelectedSystem(system);
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setTimer(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  // Kart Tıklama
  const handleCardClick = (id) => {
    if (gameOver || flippedCards.length >= 2 || flippedCards.includes(id) || matchedCards.includes(id)) return;

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard.pairId === secondCard.pairId) {
        setMatchedCards(prev => [...prev, firstId, secondId]);
        setFlippedCards([]);
        toast.success("Doğru Eşleşme!", { duration: 1000 });
        if (matchedCards.length + 2 === cards.length) endGame();
      } else {
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  const endGame = () => {
    setGameOver(true);
    setIsPlaying(false);
    const score = Math.max(10, 1000 - (timer * 5));
    saveMatchScore(score, timer);
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // --- EKRAN 1: SİSTEM SEÇİMİ ---
  if (!selectedSystem) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Eşleştirme Oyunu</h1>
          <p className="text-gray-600">Hangi sistemdeki terimlerle hafızanı test etmek istersin?</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {systems.map((system) => (
            <SimpleCard
              key={system}
              className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-blue-500 group"
              onClick={() => initializeGame(system)}
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <span className="font-semibold text-gray-800">{system}</span>
              </div>
            </SimpleCard>
          ))}
        </div>
      </div>
    );
  }

  // --- EKRAN 2: OYUN ALANI ---
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <SimpleButton variant="ghost" onClick={() => setSelectedSystem(null)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Çıkış
          </SimpleButton>
          <span className="font-semibold text-blue-900">{selectedSystem}</span>
        </div>
        <div className="flex items-center space-x-6 text-lg font-mono">
          <div className="flex items-center text-blue-600"><Timer className="w-5 h-5 mr-2" />{formatTime(timer)}</div>
          <div className="flex items-center text-purple-600"><RefreshCw className="w-5 h-5 mr-2" />{moves} Hamle</div>
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 h-[600px] md:h-auto">
        <AnimatePresence>
          {cards.map((card) => {
            const isFlipped = flippedCards.includes(card.id) || matchedCards.includes(card.id);
            const isMatched = matchedCards.includes(card.id);
            return (
              <motion.div
                key={card.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative aspect-[3/4] perspective-1000 cursor-pointer"
                onClick={() => handleCardClick(card.id)}
              >
                <div
                  className={`w-full h-full transition-all duration-500 transform preserve-3d relative ${isFlipped ? 'rotate-y-180' : ''}`}
                  style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                >
                  {/* Kart Arkası */}
                  <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl shadow-md flex items-center justify-center border-2 border-white/20">
                    <Brain className="w-8 h-8 text-white/50" />
                  </div>
                  {/* Kart Önü */}
                  <div
                    className={`absolute w-full h-full backface-hidden rounded-xl shadow-xl flex items-center justify-center p-4 text-center border-2 
                    ${isMatched ? 'bg-green-50 border-green-500' : 'bg-white border-blue-600'}`}
                    style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
                  >
                    <div>
                      <p className={`font-bold ${card.type === 'term' ? 'text-xl text-blue-900' : 'text-md text-gray-700'}`}>
                        {card.content}
                      </p>
                      {isMatched && <Trophy className="w-6 h-6 text-green-500 mx-auto mt-2 animate-bounce" />}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {gameOver && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <SimpleCard className="max-w-md w-full p-8 text-center space-y-6">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto" />
            <div><h2 className="text-3xl font-bold text-gray-900">Tebrikler!</h2></div>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="p-4 bg-blue-50 rounded-lg"><div className="text-sm text-blue-600 font-semibold">Süre</div><div className="text-2xl font-bold">{formatTime(timer)}</div></div>
              <div className="p-4 bg-purple-50 rounded-lg"><div className="text-sm text-purple-600 font-semibold">Hamle</div><div className="text-2xl font-bold">{moves}</div></div>
            </div>
            <SimpleButton className="w-full h-12 text-lg" onClick={() => setSelectedSystem(null)}>Tekrar Oyna</SimpleButton>
          </SimpleCard>
        </motion.div>
      )}
    </div>
  );
};