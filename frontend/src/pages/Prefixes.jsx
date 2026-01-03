import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { medicalPrefixes, getCategories, getPrefixesByCategory, searchPrefixes } from '@/data/medicalPrefixes';
import { saveProgress, getTermProgress } from '@/utils/storage';
import { toast } from 'sonner';

export const Prefixes = () => {
    const [selectedCategory, setSelectedCategory] = useState('Olumsuzluk / Yokluk');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCategories, setExpandedCategories] = useState({});
    const [updateTrigger, setUpdateTrigger] = useState(0);

    // Get all categories
    const categories = useMemo(() => getCategories(), []);

    // Get prefixes for selected category or search results
    const displayData = useMemo(() => {
        if (searchQuery.trim()) {
            return searchPrefixes(searchQuery);
        }

        const prefixes = getPrefixesByCategory(selectedCategory);
        return [{
            category: selectedCategory,
            prefixes: prefixes
        }];
    }, [selectedCategory, searchQuery, updateTrigger]);

    // Toggle category expansion
    const toggleCategory = (categoryName) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryName]: !prev[categoryName]
        }));
    };

    // Handle mark as learned
    const handleMarkAsLearned = (prefixId) => {
        const progress = getTermProgress(prefixId);
        const newStatus = !progress.learned;
        saveProgress(prefixId, newStatus);
        toast.success(newStatus ? 'Ön ek öğrenildi olarak işaretlendi!' : 'Öğrenildi işareti kaldırıldı');
        // Force re-render
        setUpdateTrigger(prev => prev + 1);
    };

    // Calculate total prefixes count
    const totalPrefixes = useMemo(() => {
        return displayData.reduce((sum, item) => sum + item.prefixes.length, 0);
    }, [displayData]);

    return (
        <div className="min-h-screen bg-muted/30 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/study" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Çalış Sayfasına Dön
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">Tıbbi Ön Ekler</h1>
                    <p className="text-lg text-muted-foreground">
                        Kategorilere göre tıbbi ön ekleri incele, öğren ve öğrendiklerini işaretle
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar - Category Filter */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            <Card className="p-4">
                                <h2 className="text-lg font-semibold mb-4">Kategoriler</h2>
                                <div className="space-y-2">
                                    {categories.map((category) => (
                                        <Button
                                            key={category}
                                            variant={selectedCategory === category ? 'default' : 'outline'}
                                            className="w-full justify-start text-sm"
                                            onClick={() => {
                                                setSelectedCategory(category);
                                                setSearchQuery(''); // Clear search when changing category
                                            }}
                                        >
                                            {category}
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
                                    placeholder="Ön ek veya anlam ara..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            {(searchQuery || displayData.length > 0) && (
                                <p className="text-sm text-muted-foreground mt-2">
                                    {totalPrefixes} ön ek bulundu
                                </p>
                            )}
                        </div>

                        {/* Prefixes grouped by category */}
                        {displayData.length === 0 ? (
                            <Card className="p-12 text-center">
                                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2">Ön ek bulunamadı</h3>
                                <p className="text-muted-foreground">Arama kriterlerinizi değiştirmeyi deneyin</p>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {displayData.map((item, idx) => {
                                    const categoryKey = item.category;
                                    const isExpanded = expandedCategories[categoryKey] !== false; // Default to expanded

                                    return (
                                        <Card key={categoryKey}>
                                            <CardHeader
                                                className="cursor-pointer hover:bg-muted/50 transition-colors"
                                                onClick={() => toggleCategory(categoryKey)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <CardTitle className="text-xl">
                                                            {item.category}
                                                        </CardTitle>
                                                        <Badge variant="secondary">
                                                            {item.prefixes.length} ön ek
                                                        </Badge>
                                                    </div>
                                                    {isExpanded ? (
                                                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                                                    ) : (
                                                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                                    )}
                                                </div>
                                            </CardHeader>

                                            {isExpanded && (
                                                <CardContent>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {item.prefixes.map((prefix) => {
                                                            const progress = getTermProgress(prefix.id);
                                                            return (
                                                                <Card
                                                                    key={prefix.id}
                                                                    className={`transition-all hover:shadow-lg ${progress.learned ? 'border-success bg-success/5' : ''
                                                                        }`}
                                                                >
                                                                    <CardContent className="p-4">
                                                                        <div className="flex items-start justify-between mb-3">
                                                                            <div className="flex-1">
                                                                                <h3 className="text-lg font-bold mb-1">{prefix.prefix}</h3>
                                                                                <p className="text-base text-muted-foreground">{prefix.meaning}</p>
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
                                                                            onClick={() => handleMarkAsLearned(prefix.id)}
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
                                                </CardContent>
                                            )}
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
