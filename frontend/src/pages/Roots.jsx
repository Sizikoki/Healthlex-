import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { medicalRoots, getSystems, getSubcategories, searchRoots } from '@/data/medicalRoots';
import { saveProgress, getTermProgress } from '@/utils/storage';
import { toast } from 'sonner';

export const Roots = () => {
    const [selectedSystem, setSelectedSystem] = useState('Hareket Sistemi');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCategories, setExpandedCategories] = useState({});
    const [updateTrigger, setUpdateTrigger] = useState(0);

    // Get all systems
    const systems = useMemo(() => getSystems(), []);

    // Get subcategories for selected system or search results
    const displayData = useMemo(() => {
        if (searchQuery.trim()) {
            return searchRoots(searchQuery);
        }

        const subcategories = getSubcategories(selectedSystem);
        return subcategories.map(sub => ({
            system: selectedSystem,
            subcategory: sub.name,
            roots: sub.roots
        }));
    }, [selectedSystem, searchQuery, updateTrigger]);

    // Toggle category expansion
    const toggleCategory = (categoryName) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryName]: !prev[categoryName]
        }));
    };

    // Handle mark as learned
    const handleMarkAsLearned = (rootId) => {
        const progress = getTermProgress(rootId);
        const newStatus = !progress.learned;
        saveProgress(rootId, newStatus);
        toast.success(newStatus ? 'Kök öğrenildi olarak işaretlendi!' : 'Öğrenildi işareti kaldırıldı');
        // Force re-render
        setUpdateTrigger(prev => prev + 1);
    };

    // Calculate total roots count
    const totalRoots = useMemo(() => {
        return displayData.reduce((sum, item) => sum + item.roots.length, 0);
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
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">Tıbbi Kökler</h1>
                    <p className="text-lg text-muted-foreground">
                        Sistemlere göre tıbbi kökleri incele, öğren ve öğrendiklerini işaretle
                    </p>
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
                                            className="w-full justify-start text-sm"
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
                                    placeholder="Kök veya anlam ara..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            {(searchQuery || displayData.length > 0) && (
                                <p className="text-sm text-muted-foreground mt-2">
                                    {totalRoots} kök bulundu
                                </p>
                            )}
                        </div>

                        {/* Roots grouped by subcategory */}
                        {displayData.length === 0 ? (
                            <Card className="p-12 text-center">
                                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2">Kök bulunamadı</h3>
                                <p className="text-muted-foreground">Arama kriterlerinizi değiştirmeyi deneyin</p>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {displayData.map((item, idx) => {
                                    const categoryKey = `${item.system}-${item.subcategory}`;
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
                                                            {item.subcategory}
                                                        </CardTitle>
                                                        <Badge variant="secondary">
                                                            {item.roots.length} kök
                                                        </Badge>
                                                    </div>
                                                    {isExpanded ? (
                                                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                                                    ) : (
                                                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                                    )}
                                                </div>
                                                {searchQuery && (
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {item.system}
                                                    </p>
                                                )}
                                            </CardHeader>

                                            {isExpanded && (
                                                <CardContent>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {item.roots.map((root) => {
                                                            const progress = getTermProgress(root.id);
                                                            return (
                                                                <Card
                                                                    key={root.id}
                                                                    className={`transition-all hover:shadow-lg ${progress.learned ? 'border-success bg-success/5' : ''
                                                                        }`}
                                                                >
                                                                    <CardContent className="p-4">
                                                                        <div className="flex items-start justify-between mb-3">
                                                                            <div className="flex-1">
                                                                                <h3 className="text-lg font-bold mb-1">{root.root}</h3>
                                                                                <p className="text-base text-muted-foreground">{root.meaning}</p>
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
                                                                            onClick={() => handleMarkAsLearned(root.id)}
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
