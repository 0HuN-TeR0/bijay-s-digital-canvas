import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Users, Heart, AlertTriangle, Loader2, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface NLPResult {
  sentiment: {
    overall: string;
    score: number;
    breakdown: { positive: number; negative: number; neutral: number };
  };
  genderAnalysis: {
    maleReferences: number;
    femaleReferences: number;
    neutralReferences: number;
    biasIndicators: string[];
    biasScore: number;
  };
  socialRepresentation: {
    dominantThemes: string[];
    representationScore: number;
    observations: string[];
  };
  recommendations: string[];
}

const NLPAnalysisDemo = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NLPResult | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim() || text.length < 50) {
      toast.error('Please enter at least 50 characters of text to analyze');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-demo', {
        body: { type: 'nlp-analysis', data: { text } },
      });

      if (error) throw error;
      
      setResult(data);
      toast.success('Analysis complete!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to analyze text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': return 'text-green-500';
      case 'negative': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  const sampleTexts = [
    "The CEO announced that all employees should work harder to meet the company's ambitious goals. The chairman praised the hardworking staff and mentioned that the salesmen exceeded their targets. Meanwhile, the cleaning ladies and secretaries continued their daily routines.",
    "Our diverse team of engineers, including both men and women, collaborated to solve complex problems. The project lead ensured everyone's voice was heard, regardless of their background. Team members contributed equally to the success of the initiative.",
    "Scientists have discovered new findings about climate change. The researchers, predominantly from leading universities, published their results. The study suggests immediate action is needed to address environmental concerns.",
  ];

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
              <h1 className="text-2xl font-bold font-mono text-foreground">NLP Gender Analysis</h1>
              <p className="text-sm text-muted-foreground">Analyze text for gender representation & sentiment</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Input Section */}
        <Card className="bg-card border-border mb-8">
          <CardHeader>
            <CardTitle className="font-mono flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Text Input
            </CardTitle>
            <CardDescription>
              Enter text to analyze for gender representation, sentiment, and social bias patterns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste or type your text here (minimum 50 characters)..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[200px] bg-secondary"
            />
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{text.length} characters</span>
              <div className="flex gap-2">
                {sampleTexts.map((sample, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    onClick={() => setText(sample)}
                  >
                    Sample {i + 1}
                  </Button>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleAnalyze} 
              disabled={loading || text.length < 50} 
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
                  <BarChart className="h-5 w-5 mr-2" />
                  Analyze Text
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
            className="space-y-6"
          >
            {/* Sentiment Analysis */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="font-mono flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-500" />
                  Sentiment Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-sm text-muted-foreground">Overall Sentiment</span>
                    <p className={`text-2xl font-bold font-mono capitalize ${getSentimentColor(result.sentiment.overall)}`}>
                      {result.sentiment.overall}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-muted-foreground">Confidence</span>
                    <p className="text-2xl font-bold font-mono">{Math.round(result.sentiment.score * 100)}%</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-green-500">Positive</span>
                      <span>{result.sentiment.breakdown.positive}%</span>
                    </div>
                    <Progress value={result.sentiment.breakdown.positive} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-yellow-500">Neutral</span>
                      <span>{result.sentiment.breakdown.neutral}%</span>
                    </div>
                    <Progress value={result.sentiment.breakdown.neutral} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-red-500">Negative</span>
                      <span>{result.sentiment.breakdown.negative}%</span>
                    </div>
                    <Progress value={result.sentiment.breakdown.negative} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gender Analysis */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="font-mono flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Gender Representation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                    <p className="text-3xl font-mono font-bold text-blue-500">{result.genderAnalysis.maleReferences}</p>
                    <p className="text-sm text-muted-foreground">Male References</p>
                  </div>
                  <div className="text-center p-4 bg-pink-500/10 rounded-lg">
                    <p className="text-3xl font-mono font-bold text-pink-500">{result.genderAnalysis.femaleReferences}</p>
                    <p className="text-sm text-muted-foreground">Female References</p>
                  </div>
                  <div className="text-center p-4 bg-purple-500/10 rounded-lg">
                    <p className="text-3xl font-mono font-bold text-purple-500">{result.genderAnalysis.neutralReferences}</p>
                    <p className="text-sm text-muted-foreground">Neutral References</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Bias Score</span>
                    <span className={result.genderAnalysis.biasScore > 0.5 ? 'text-red-500' : 'text-green-500'}>
                      {Math.round(result.genderAnalysis.biasScore * 100)}%
                    </span>
                  </div>
                  <Progress value={result.genderAnalysis.biasScore * 100} className="h-2" />
                </div>

                {result.genderAnalysis.biasIndicators.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      Bias Indicators Found
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {result.genderAnalysis.biasIndicators.map((indicator, i) => (
                        <span key={i} className="px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-xs">
                          {indicator}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Social Representation */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="font-mono">Social Representation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Dominant Themes</p>
                  <div className="flex flex-wrap gap-2">
                    {result.socialRepresentation.dominantThemes.map((theme, i) => (
                      <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Key Observations</p>
                  <ul className="space-y-2">
                    {result.socialRepresentation.observations.map((obs, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        {obs}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="bg-gradient-to-r from-primary/10 to-green-500/10 border-primary/30">
              <CardHeader>
                <CardTitle className="font-mono">Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default NLPAnalysisDemo;
