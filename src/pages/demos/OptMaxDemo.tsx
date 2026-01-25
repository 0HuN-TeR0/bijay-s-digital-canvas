import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Cpu, Zap, HardDrive, Calendar, Loader2, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface GPURecommendation {
  name: string;
  price: string;
  benchmark: string;
  vram: string;
  year: string;
  matchScore: number;
  explanation: string;
}

interface OptMaxResult {
  recommendations: GPURecommendation[];
  analysis: string;
}

const OptMaxDemo = () => {
  const [preferences, setPreferences] = useState({
    budget: 50,
    performance: 50,
    vram: 50,
    recency: 50,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OptMaxResult | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-demo', {
        body: { type: 'optmax', data: preferences },
      });

      if (error) throw error;
      
      setResult(data);
      toast.success('GPU recommendations generated!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-orange-500';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to="/#projects">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold font-mono text-foreground">OptMax</h1>
              <p className="text-sm text-muted-foreground">AI-Powered GPU Recommendation System</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Algorithm Explanation */}
        <Card className="bg-card border-border mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-mono">
              <Info className="h-5 w-5 text-primary" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              OptMax uses a weighted K-Nearest Neighbors (KNN) algorithm to recommend GPUs based on your preferences. 
              Each GPU is represented as a feature vector (price, benchmark score, VRAM, release year), normalized and 
              weighted according to your priorities. The system finds GPUs that minimize the weighted distance to your 
              ideal profile and explains why each recommendation matches your needs.
            </p>
          </CardContent>
        </Card>

        {/* Preference Sliders */}
        <Card className="bg-card border-border mb-8">
          <CardHeader>
            <CardTitle className="font-mono">Set Your Preferences</CardTitle>
            <CardDescription>Adjust the importance of each factor (0 = not important, 100 = critical)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <Zap className="h-5 w-5 text-green-500" />
                  </div>
                  <span className="font-medium">Budget Priority</span>
                </div>
                <span className="font-mono text-primary">{preferences.budget}%</span>
              </div>
              <Slider
                value={[preferences.budget]}
                onValueChange={([value]) => setPreferences(p => ({ ...p, budget: value }))}
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">Higher = prefer cheaper GPUs</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-red-500/10">
                    <Cpu className="h-5 w-5 text-red-500" />
                  </div>
                  <span className="font-medium">Performance Priority</span>
                </div>
                <span className="font-mono text-primary">{preferences.performance}%</span>
              </div>
              <Slider
                value={[preferences.performance]}
                onValueChange={([value]) => setPreferences(p => ({ ...p, performance: value }))}
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">Higher = prefer faster GPUs (benchmark scores)</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <HardDrive className="h-5 w-5 text-blue-500" />
                  </div>
                  <span className="font-medium">VRAM Priority</span>
                </div>
                <span className="font-mono text-primary">{preferences.vram}%</span>
              </div>
              <Slider
                value={[preferences.vram]}
                onValueChange={([value]) => setPreferences(p => ({ ...p, vram: value }))}
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">Higher = prefer GPUs with more memory</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Calendar className="h-5 w-5 text-purple-500" />
                  </div>
                  <span className="font-medium">Recency Priority</span>
                </div>
                <span className="font-mono text-primary">{preferences.recency}%</span>
              </div>
              <Slider
                value={[preferences.recency]}
                onValueChange={([value]) => setPreferences(p => ({ ...p, recency: value }))}
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">Higher = prefer newer GPU models</p>
            </div>

            <Button 
              onClick={handleAnalyze} 
              disabled={loading} 
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Cpu className="h-5 w-5 mr-2" />
                  Get GPU Recommendations
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Analysis Summary */}
            <Card className="bg-card border-border mb-6">
              <CardHeader>
                <CardTitle className="font-mono">Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{result.analysis}</p>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-mono">Top Recommendations</h3>
              {result.recommendations?.map((gpu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-card border-border hover:border-primary/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl font-mono font-bold text-primary">#{index + 1}</span>
                            <h4 className="text-xl font-bold">{gpu.name}</h4>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="text-center p-3 bg-secondary/50 rounded-lg">
                              <p className="text-xs text-muted-foreground">Price</p>
                              <p className="font-mono font-semibold text-green-500">{gpu.price}</p>
                            </div>
                            <div className="text-center p-3 bg-secondary/50 rounded-lg">
                              <p className="text-xs text-muted-foreground">Benchmark</p>
                              <p className="font-mono font-semibold text-red-500">{gpu.benchmark}</p>
                            </div>
                            <div className="text-center p-3 bg-secondary/50 rounded-lg">
                              <p className="text-xs text-muted-foreground">VRAM</p>
                              <p className="font-mono font-semibold text-blue-500">{gpu.vram}</p>
                            </div>
                            <div className="text-center p-3 bg-secondary/50 rounded-lg">
                              <p className="text-xs text-muted-foreground">Year</p>
                              <p className="font-mono font-semibold text-purple-500">{gpu.year}</p>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground">{gpu.explanation}</p>
                        </div>
                        
                        <div className="text-center">
                          <div className={`text-3xl font-mono font-bold ${getScoreColor(gpu.matchScore)}`}>
                            {gpu.matchScore}
                          </div>
                          <p className="text-xs text-muted-foreground">Match</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default OptMaxDemo;
