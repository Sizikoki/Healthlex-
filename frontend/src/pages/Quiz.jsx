import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Trophy, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { medicalTerms } from '@/data/medicalData';
import { saveQuizScore, updateStreak } from '@/utils/storage';
import { toast } from 'sonner';

export const Quiz = () => {
  const navigate = useNavigate();
  
  // System selection state
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [showSystemSelection, setShowSystemSelection] = useState(true);
  
  // Quiz state
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizComplete, setQuizComplete] = useState(false);

  // Get unique systems from the data
  const systems = useMemo(() => {
    const uniqueSystems = [...new Set(medicalTerms.map(term => term.system))];
    return uniqueSystems.sort();
  }, []);

  useEffect(() => {
    if (selectedSystem) {
      initializeQuiz();
      updateStreak();
    }
  }, [selectedSystem]);

  const initializeQuiz = () => {
    // Filter terms by selected system
    let filteredTerms = medicalTerms;
    if (selectedSystem !== 'Karışık (Tüm Sistemler)') {
      filteredTerms = medicalTerms.filter(term => term.system === selectedSystem);
    }

    // Select 10 random terms
    const shuffled = [...filteredTerms].sort(() => Math.random() - 0.5);
    const selectedTerms = shuffled.slice(0, Math.min(10, shuffled.length));

    // Generate questions
    const quizQuestions = selectedTerms.map((term, index) => {
      // Get distractors - prefer same system, fallback to all terms
      const sameSystemTerms = medicalTerms.filter(t => 
        t.id !== term.id && t.system === term.system
      );
      
      let distractorPool = sameSystemTerms;
      if (sameSystemTerms.length < 3) {
        // Not enough terms in same system, use all terms
        distractorPool = medicalTerms.filter(t => t.id !== term.id);
      }

      // Get 3 random wrong answers
      const wrongAnswers = [...distractorPool]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(t => t.meaning);

      // Combine correct answer with wrong answers and shuffle
      const options = [term.meaning, ...wrongAnswers].sort(() => Math.random() - 0.5);

      return {
        id: index,
        term: term.term,
        correctAnswer: term.meaning,
        options: options,
        system: term.system,
        category: term.category
      };
    });

    setQuestions(quizQuestions);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setQuizComplete(false);
    setShowSystemSelection(false);
  };

  const handleAnswerSelect = (answer) => {
    if (!showResult) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmit = () => {
    if (!selectedAnswer) {
      toast.error('Lütfen bir cevap seçin');
      return;
    }

    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    setShowResult(true);

    const newAnswers = [...answers, {
      questionId: currentQuestion,
      selectedAnswer,
      isCorrect
    }];
    setAnswers(newAnswers);

    if (isCorrect) {
      setScore(score + 1);
      toast.success('Doğru cevap! 🎉');
    } else {
      toast.error('Yanlış cevap');
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz complete - calculate final score from all answers
      const finalScore = answers.filter(a => a.isCorrect).length;
      setScore(finalScore);
      setQuizComplete(true);
      saveQuizScore(selectedSystem || 'all', finalScore, questions.length);
    }
  };

  const handlePlayAgain = () => {
    setShowSystemSelection(true);
    setSelectedSystem(null);
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setQuizComplete(false);
  };

  // System Selection Screen
  if (showSystemSelection) {
    return (
      <div className="min-h-screen bg-muted/30 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/games')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Oyunlara Dön
            </Button>
            
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Quiz</h1>
            <p className="text-lg text-muted-foreground">Bir sistem seçin ve bilginizi test edin</p>
          </div>

          {/* System Selection */}
          <Card className="shadow-lg">
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-xl font-semibold mb-6">Sistem Seçin</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button
                  variant={selectedSystem === 'Karışık (Tüm Sistemler)' ? 'default' : 'outline'}
                  className="h-20 text-base"
                  onClick={() => setSelectedSystem('Karışık (Tüm Sistemler)')}
                >
                  <div className="text-center">
                    <div className="font-semibold">Karışık</div>
                    <div className="text-xs text-muted-foreground mt-1">Tüm Sistemler</div>
                  </div>
                </Button>
                {systems.map((system) => (
                  <Button
                    key={system}
                    variant={selectedSystem === system ? 'default' : 'outline'}
                    className="h-20 text-base"
                    onClick={() => setSelectedSystem(system)}
                  >
                    {system}
                  </Button>
                ))}
              </div>
              
              {selectedSystem && (
                <div className="mt-6 pt-6 border-t">
                  <Button
                    onClick={initializeQuiz}
                    className="w-full h-12 text-lg gradient-primary"
                  >
                    Quiz'i Başlat
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Loading state
  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const finalScore = quizComplete ? score : 0;
  const percentage = quizComplete ? Math.round((score / questions.length) * 100) : 0;

  // Quiz Complete Screen
  if (quizComplete) {
    return (
      <div className="min-h-screen bg-muted/30 py-8 flex items-center justify-center">
        <Card className="max-w-2xl w-full mx-4 shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
              percentage >= 80 ? 'bg-gradient-to-br from-success to-secondary' :
              percentage >= 60 ? 'bg-gradient-to-br from-primary to-accent' :
              'bg-gradient-to-br from-accent to-destructive'
            }`}>
              <Trophy className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold mb-2">Quiz Tamamlandı!</h2>
            <p className="text-lg text-muted-foreground mb-2">
              Sistem: {selectedSystem}
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              {percentage >= 80 ? 'Mükemmel!' : percentage >= 60 ? 'İyi çalıştın!' : 'Pratik yapmaya devam et!'}
            </p>
            
            <div className="mb-8">
              <div className="text-6xl font-bold text-primary mb-2">{finalScore}/{questions.length}</div>
              <div className="text-xl text-muted-foreground">Doğru Cevap (%{percentage})</div>
            </div>
            
            {/* Answer Review */}
            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
              {questions.map((q, index) => {
                const answer = answers.find(a => a.questionId === index);
                return (
                  <div key={index} className={`p-3 rounded-lg border text-left ${
                    answer?.isCorrect ? 'bg-success/10 border-success' : 'bg-destructive/10 border-destructive'
                  }`}>
                    <div className="flex items-start gap-2">
                      {answer?.isCorrect ? 
                        <Check className="w-5 h-5 text-success mt-0.5" /> : 
                        <X className="w-5 h-5 text-destructive mt-0.5" />
                      }
                      <div className="flex-1">
                        <div className="font-semibold">{q.term}</div>
                        <div className="text-sm text-muted-foreground">Doğru: {q.correctAnswer}</div>
                        {!answer?.isCorrect && (
                          <div className="text-sm text-destructive">Senin cevabın: {answer?.selectedAnswer}</div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={handlePlayAgain} className="flex-1">
                <RotateCw className="w-4 h-4 mr-2" />
                Tekrar Oyna
              </Button>
              <Button onClick={() => navigate('/games')} className="flex-1 gradient-primary">
                Oyunları Gör
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Active Quiz Screen
  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/games')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Oyunlara Dön
          </Button>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Quiz</h1>
              <p className="text-muted-foreground">
                {selectedSystem} • Soru {currentQuestion + 1} / {questions.length}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{score}</div>
              <div className="text-sm text-muted-foreground">Puan</div>
            </div>
          </div>
          
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="p-6 sm:p-8">
            <div className="mb-6">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Bu terimin Türkçe karşılığı nedir?
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold">{question.term}</h2>
              {question.category && (
                <div className="mt-3 text-sm bg-accent/10 px-3 py-2 rounded-lg border border-accent/20 inline-block">
                  {question.category}
                </div>
              )}
            </div>
            
            <RadioGroup value={selectedAnswer || ''} onValueChange={handleAnswerSelect}>
              <div className="space-y-3">
                {question.options.map((option, index) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = option === question.correctAnswer;
                  const showCorrect = showResult && isCorrect;
                  const showWrong = showResult && isSelected && !isCorrect;
                  
                  return (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        showCorrect ? 'bg-success/10 border-success' :
                        showWrong ? 'bg-destructive/10 border-destructive' :
                        isSelected ? 'bg-primary/10 border-primary' :
                        'border-border hover:border-primary/50 hover:bg-muted'
                      }`}
                      onClick={() => !showResult && handleAnswerSelect(option)}
                    >
                      <RadioGroupItem value={option} id={`option-${index}`} disabled={showResult} />
                      <Label 
                        htmlFor={`option-${index}`} 
                        className="flex-1 cursor-pointer font-medium"
                      >
                        {option}
                      </Label>
                      {showCorrect && <Check className="w-5 h-5 text-success" />}
                      {showWrong && <X className="w-5 h-5 text-destructive" />}
                    </div>
                  );
                })}
              </div>
            </RadioGroup>
            
            {showResult && (
              <div className={`mt-6 p-4 rounded-lg ${
                selectedAnswer === question.correctAnswer ? 'bg-success/10 border border-success' : 'bg-destructive/10 border border-destructive'
              }`}>
                <div className="flex items-start gap-3">
                  {selectedAnswer === question.correctAnswer ? 
                    <Check className="w-6 h-6 text-success mt-0.5" /> : 
                    <X className="w-6 h-6 text-destructive mt-0.5" />
                  }
                  <div>
                    <div className="font-semibold mb-1">
                      {selectedAnswer === question.correctAnswer ? 'Doğru!' : 'Yanlış!'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Doğru cevap: {question.correctAnswer}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          {!showResult ? (
            <Button
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className="w-full h-14 text-lg gradient-primary"
            >
              Cevabı Kontrol Et
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="w-full h-14 text-lg gradient-primary"
            >
              {currentQuestion < questions.length - 1 ? 'Sonraki Soru' : 'Sonuçları Gör'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
