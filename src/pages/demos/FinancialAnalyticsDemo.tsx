import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, Activity, DollarSign, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface FinancialResult {
  ticker: string;
  technicalAnalysis: {
    trend: string;
    movingAverages: {
      ma20: string;
      ma50: string;
      signal: string;
    };
    rsi: {
      value: number;
      signal: string;
    };
    macd: {
      signal: string;
    };
  };
  fundamentalAnalysis: {
    peRatio: string;
    marketCap: string;
    sentiment: string;
  };
  prediction: {
    shortTerm: string;
    confidence: number;
    reasoning: string;
  };
  riskLevel: string;
  recommendation: string;
}

const popularTickers = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA', 'META', 'AMZN', 'AMD'];

const FinancialAnalyticsDemo = () => {
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FinancialResult | null>(null);

  const handleAnalyze = async (selectedTicker?: string) => {
    const tickerToAnalyze = selectedTicker || ticker;
    if (!tickerToAnalyze.trim()) {
      toast.error('Please enter a stock ticker');
      return;
    }

    setTicker(tickerToAnalyze);
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-demo', {
        body: { type: 'financial-analytics', data: { ticker: tickerToAnalyze.toUpperCase() } },
      });

      if (error) throw error;
      
      setResult(data);
      toast.success(`Analysis complete for ${tickerToAnalyze.toUpperCase()}`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to analyze. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend.toLowerCase().includes('bullish') || trend.toLowerCase() === 'up') {
      return <TrendingUp className="h-5 w-5 text-green-500" />;
    }
    if (trend.toLowerCase().includes('bearish') || trend.toLowerCase() === 'down') {
      return <TrendingDown className="h-5 w-5 text-red-500" />;
    }
    return <Activity className="h-5 w-5 text-yellow-500" />;
  };

  const getSignalColor = (signal: string) => {
    const s = signal.toLowerCase();
    if (s.includes('buy') || s.includes('bullish') || s.includes('positive')) return 'text-green-500 bg-green-500/10';
    if (s.includes('sell') || s.includes('bearish') || s.includes('negative')) return 'text-red-500 bg-red-500/10';
    return 'text-yellow-500 bg-yellow-500/10';
  };

  const getRiskColor = (risk: string) => {
    const r = risk.toLowerCase();
    if (r === 'low') return 'text-green-500';
    if (r === 'high') return 'text-red-500';
    return 'text-yellow-500';
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
              <h1 className="text-2xl font-bold font-mono text-foreground">Financial Analytics</h1>
              <p className="text-sm text-muted-foreground">Technical & Fundamental Analysis</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Disclaimer */}
        <Card className="bg-yellow-500/10 border-yellow-500/30 mb-8">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-500">
              <strong>Disclaimer:</strong> This is an AI-powered educational demo. Not financial advice. 
              Always do your own research before making investment decisions.
            </p>
          </CardContent>
        </Card>

        {/* Input */}
        <Card className="bg-card border-border mb-8">
          <CardHeader>
            <CardTitle className="font-mono flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Stock Analysis
            </CardTitle>
            <CardDescription>Enter a stock ticker symbol to get AI-powered analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="Enter ticker (e.g., AAPL)"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                className="bg-secondary font-mono"
                maxLength={10}
              />
              <Button onClick={() => handleAnalyze()} disabled={loading}>
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Analyze'}
              </Button>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Popular stocks:</p>
              <div className="flex flex-wrap gap-2">
                {popularTickers.map((t) => (
                  <Button
                    key={t}
                    variant="outline"
                    size="sm"
                    onClick={() => handleAnalyze(t)}
                    disabled={loading}
                    className="font-mono"
                  >
                    {t}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header with Recommendation */}
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-mono font-bold">{result.ticker}</h2>
                    <p className="text-muted-foreground">Stock Analysis Report</p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getSignalColor(result.recommendation)}`}>
                      {result.recommendation.toLowerCase().includes('buy') ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : result.recommendation.toLowerCase().includes('sell') ? (
                        <AlertTriangle className="h-5 w-5" />
                      ) : (
                        <Activity className="h-5 w-5" />
                      )}
                      <span className="font-semibold">{result.recommendation.split(' ')[0]}</span>
                    </div>
                    <p className={`text-sm mt-1 ${getRiskColor(result.riskLevel)}`}>
                      {result.riskLevel} Risk
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical Analysis */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="font-mono flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  Technical Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Trend */}
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      {getTrendIcon(result.technicalAnalysis.trend)}
                      <span className="font-medium">Overall Trend</span>
                    </div>
                    <p className="text-lg font-mono capitalize">{result.technicalAnalysis.trend}</p>
                  </div>

                  {/* RSI */}
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">RSI (14)</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-mono font-bold">{result.technicalAnalysis.rsi.value}</span>
                      <span className={`px-2 py-1 rounded text-xs ${getSignalColor(result.technicalAnalysis.rsi.signal)}`}>
                        {result.technicalAnalysis.rsi.signal}
                      </span>
                    </div>
                  </div>

                  {/* Moving Averages */}
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Moving Averages</p>
                    <div className="space-y-1 text-sm">
                      <p>MA(20): <span className="font-mono">{result.technicalAnalysis.movingAverages.ma20}</span></p>
                      <p>MA(50): <span className="font-mono">{result.technicalAnalysis.movingAverages.ma50}</span></p>
                    </div>
                    <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${getSignalColor(result.technicalAnalysis.movingAverages.signal)}`}>
                      {result.technicalAnalysis.movingAverages.signal}
                    </span>
                  </div>

                  {/* MACD */}
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">MACD</p>
                    <span className={`px-2 py-1 rounded text-sm ${getSignalColor(result.technicalAnalysis.macd.signal)}`}>
                      {result.technicalAnalysis.macd.signal}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fundamental Analysis */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="font-mono flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  Fundamental Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-secondary/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">P/E Ratio</p>
                    <p className="text-xl font-mono font-bold">{result.fundamentalAnalysis.peRatio}</p>
                  </div>
                  <div className="text-center p-4 bg-secondary/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Market Cap</p>
                    <p className="text-xl font-mono font-bold">{result.fundamentalAnalysis.marketCap}</p>
                  </div>
                  <div className="text-center p-4 bg-secondary/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Sentiment</p>
                    <p className={`text-xl font-mono font-bold capitalize ${
                      result.fundamentalAnalysis.sentiment === 'positive' ? 'text-green-500' : 
                      result.fundamentalAnalysis.sentiment === 'negative' ? 'text-red-500' : 'text-yellow-500'
                    }`}>
                      {result.fundamentalAnalysis.sentiment}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prediction */}
            <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/30">
              <CardHeader>
                <CardTitle className="font-mono">AI Prediction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getTrendIcon(result.prediction.shortTerm)}
                    <div>
                      <p className="text-sm text-muted-foreground">Short-term Direction</p>
                      <p className="text-xl font-mono font-bold capitalize">{result.prediction.shortTerm}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Confidence</p>
                    <p className="text-2xl font-mono font-bold text-primary">{result.prediction.confidence}%</p>
                  </div>
                </div>
                <p className="text-muted-foreground">{result.prediction.reasoning}</p>
              </CardContent>
            </Card>

            {/* Full Recommendation */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="font-mono">Analysis Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{result.recommendation}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default FinancialAnalyticsDemo;
