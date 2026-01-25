import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Target, DollarSign, Sparkles, Loader2, Instagram, Youtube, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface InfluencerMatch {
  name: string;
  platform: string;
  followers: string;
  niche: string;
  engagementRate: string;
  matchScore: number;
  reason: string;
}

interface CollabProResult {
  matches: InfluencerMatch[];
  strategy: string;
}

const CollabProDemo = () => {
  const [formData, setFormData] = useState({
    brandName: '',
    niche: '',
    targetAudience: '',
    budget: '',
    goals: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CollabProResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brandName || !formData.niche) {
      toast.error('Please fill in brand name and niche');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-demo', {
        body: { type: 'collab-pro', data: formData },
      });

      if (error) throw error;
      
      setResult(data);
      toast.success('Influencer matches found!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to find matches. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('instagram')) return <Instagram className="h-5 w-5 text-pink-500" />;
    if (p.includes('youtube')) return <Youtube className="h-5 w-5 text-red-500" />;
    if (p.includes('twitter') || p.includes('x')) return <Twitter className="h-5 w-5 text-blue-400" />;
    return <Users className="h-5 w-5 text-primary" />;
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-orange-500';
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
              <h1 className="text-2xl font-bold font-mono text-foreground">Collab-Pro</h1>
              <p className="text-sm text-muted-foreground">AI-Powered Influencer Marketing Platform</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Concept Explanation */}
        <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/30 mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Sparkles className="h-8 w-8 text-primary shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-2">How Collab-Pro Works</h3>
                <p className="text-muted-foreground text-sm">
                  Like a dating app for brands and influencers! Our AI analyzes brand requirements and matches them 
                  with influencers based on audience demographics, engagement patterns, content niche alignment, and 
                  campaign budget compatibility. Each match includes a confidence score and strategic reasoning.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Input Form */}
        <Card className="bg-card border-border mb-8">
          <CardHeader>
            <CardTitle className="font-mono">Brand Details</CardTitle>
            <CardDescription>Tell us about your brand to find the perfect influencer matches</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    Brand Name
                  </label>
                  <Input
                    placeholder="e.g., TechGear Pro"
                    value={formData.brandName}
                    onChange={(e) => setFormData(f => ({ ...f, brandName: e.target.value }))}
                    className="bg-secondary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Industry/Niche
                  </label>
                  <Select 
                    value={formData.niche} 
                    onValueChange={(value) => setFormData(f => ({ ...f, niche: value }))}
                  >
                    <SelectTrigger className="bg-secondary">
                      <SelectValue placeholder="Select niche" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech">Technology</SelectItem>
                      <SelectItem value="fashion">Fashion & Beauty</SelectItem>
                      <SelectItem value="fitness">Fitness & Health</SelectItem>
                      <SelectItem value="gaming">Gaming</SelectItem>
                      <SelectItem value="food">Food & Lifestyle</SelectItem>
                      <SelectItem value="finance">Finance & Business</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Target Audience</label>
                <Input
                  placeholder="e.g., Tech-savvy millennials aged 25-35"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData(f => ({ ...f, targetAudience: e.target.value }))}
                  className="bg-secondary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  Campaign Budget Range
                </label>
                <Select 
                  value={formData.budget} 
                  onValueChange={(value) => setFormData(f => ({ ...f, budget: value }))}
                >
                  <SelectTrigger className="bg-secondary">
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="micro">$500 - $2,000 (Micro)</SelectItem>
                    <SelectItem value="small">$2,000 - $10,000 (Small)</SelectItem>
                    <SelectItem value="medium">$10,000 - $50,000 (Medium)</SelectItem>
                    <SelectItem value="large">$50,000 - $200,000 (Large)</SelectItem>
                    <SelectItem value="enterprise">$200,000+ (Enterprise)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Campaign Goals</label>
                <Textarea
                  placeholder="e.g., Increase brand awareness, drive app downloads, promote new product launch..."
                  value={formData.goals}
                  onChange={(e) => setFormData(f => ({ ...f, goals: e.target.value }))}
                  className="bg-secondary min-h-[100px]"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full" size="lg">
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Finding Matches...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Find Influencer Matches
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Strategy */}
            <Card className="bg-card border-border mb-6">
              <CardHeader>
                <CardTitle className="font-mono">Recommended Strategy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{result.strategy}</p>
              </CardContent>
            </Card>

            {/* Matches */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-mono">Top Influencer Matches</h3>
              {result.matches?.map((influencer, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-card border-border hover:border-primary/50 transition-colors overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex">
                        {/* Match Score Bar */}
                        <div className={`w-2 ${getScoreColor(influencer.matchScore)}`} />
                        
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                                  {getPlatformIcon(influencer.platform)}
                                </div>
                                <div>
                                  <h4 className="text-lg font-bold">{influencer.name}</h4>
                                  <p className="text-sm text-muted-foreground">{influencer.platform}</p>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-4 mb-4">
                                <div>
                                  <p className="text-xs text-muted-foreground">Followers</p>
                                  <p className="font-mono font-semibold">{influencer.followers}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Niche</p>
                                  <p className="font-mono font-semibold">{influencer.niche}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Engagement</p>
                                  <p className="font-mono font-semibold text-green-500">{influencer.engagementRate}</p>
                                </div>
                              </div>

                              <p className="text-sm text-muted-foreground">{influencer.reason}</p>
                            </div>
                            
                            <div className="text-center px-4">
                              <div className="text-3xl font-mono font-bold text-primary">{influencer.matchScore}%</div>
                              <p className="text-xs text-muted-foreground">Match</p>
                            </div>
                          </div>
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

export default CollabProDemo;
