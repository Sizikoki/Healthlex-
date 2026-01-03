import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { medicalTerms } from '@/data/medicalData';
import { saveProgress, getTermProgress } from '@/utils/storage';
import { toast } from 'sonner';

export const Study = () => {
  const [selectedSystem, setSelectedSystem] = useState('Hareket Sistemi');
  const [searchQuery, setSearchQuery] = useState('');
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // Get unique systems from the data
  const systems = useMemo(() => {
    const uniqueSystems = [...new Set(medicalTerms.map(term => term.system))];
    return uniqueSystems.sort();
  }, []);

  // Filter and group terms by selected system and search query
  const groupedTerms = useMemo(() => {
    let filtered = medicalTerms.filter(term => term.system === selectedSystem);

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(term =>
        term.term.toLowerCase().includes(query) ||
        term.meaning.toLowerCase().includes(query) ||
        term.category.toLowerCase().includes(query)
      );
    }

    // Group by category
    const grouped = {};
    filtered.forEach(term => {
      if (!grouped[term.category]) {
        grouped[term.category] = [];
      }
      grouped[term.category].push(term);
    });

    // Sort categories alphabetically
    const sortedCategories = Object.keys(grouped).sort();
    const result = {};
    sortedCategories.forEach(cat => {
      result[cat] = grouped[cat];
    });

    return result;
  }, [selectedSystem, searchQuery, updateTrigger]);

  const handleMarkAsLearned = (termId) => {
    const progress = getTermProgress(termId);
    const newStatus = !progress.learned;
    saveProgress(termId, newStatus);
    toast.success(newStatus ? 'Terim öğrenildi olarak işaretlendi!' : 'Öğrenildi işareti kaldırıldı');
    // Force re-render
    setUpdateTrigger(prev => prev + 1);
  };

  const totalTerms = Object.values(groupedTerms).reduce((sum, terms) => sum + terms.length, 0);

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ana Sayfaya Dön
          </Link>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl sm:text-4xl font-bold">Tıbbi Terimler</h1>
            <div className="flex gap-2">
              <Link to="/study/roots">
                <Button variant="outline" className="gap-2">
                  <BookOpen className="w-4 h-4" />
                  Kökler
                </Button>
              </Link>
              <Link to="/study/prefixes">
                <Button variant="outline" className="gap-2">
                  <BookOpen className="w-4 h-4" />
                  Ön Ekler
                </Button>
              </Link>
            </div>
          </div>
          <p className="text-lg text-muted-foreground">Sistemlere göre terimleri incele, öğren ve öğrendiklerini işaretle</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - System Filter */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="p-4">
                <h2 className="text-lg font-semibold mb-4">Sistemler</h2>
                <div className="space-y-2">
                  {systems.map((system) => (
                    <Button
                      key={system}
                      variant={selectedSystem === system ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => {
                        setSelectedSystem(system);
                        setSearchQuery(''); // Clear search when changing system
                      }}
                    >
                      {system}
                    </Button>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Terim, anlam veya kategori ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              {searchQuery && (
                <p className="text-sm text-muted-foreground mt-2">
                  {totalTerms} terim bulundu
                </p>
              )}
            </div>

            {/* Terms grouped by category */}
            {totalTerms === 0 ? (
              <Card className="p-12 text-center">
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Terim bulunamadı</h3>
                <p className="text-muted-foreground">Arama kriterlerinizi değiştirmeyi deneyin</p>
              </Card>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedTerms).map(([category, terms]) => (
                  <div key={category}>
                    <h2 className="text-2xl font-bold mb-4 pb-2 border-b">
                      {category}
                      <Badge variant="secondary" className="ml-3">
                        {terms.length} terim
                      </Badge>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {terms.map((term) => {
                        const progress = getTermProgress(term.id);
                        return (
                          <Card
                            key={term.id}
                            className={`transition-all hover:shadow-lg ${progress.learned ? 'border-success bg-success/5' : ''
                              }`}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h3 className="text-lg font-bold mb-1">{term.term}</h3>
                                  <p className="text-base text-muted-foreground">{term.meaning}</p>
                                </div>
                                {progress.learned && (
                                  <Badge className="bg-success text-success-foreground ml-2">
                                    ✓
                                  </Badge>
                                )}
                              </div>
                              <Button
                                variant={progress.learned ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleMarkAsLearned(term.id)}
                                className={`w-full ${progress.learned
                                  ? 'bg-green-600 hover:bg-green-700 text-white border-green-600'
                                  : 'hover:bg-secondary'
                                  }`}
                              >
                                {progress.learned ? '✓ Öğrenildi' : 'Öğrendim'}
                              </Button>
                              {progress.reviewCount > 0 && (
                                <div className="text-xs text-muted-foreground mt-2 pt-2 border-t text-center">
                                  📊 {progress.reviewCount} kez gözden geçirildi
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
