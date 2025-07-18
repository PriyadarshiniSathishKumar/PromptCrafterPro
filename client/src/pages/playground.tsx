import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Brain, History, Settings, Play, Copy, Save, Download, Code, Clock, DollarSign, BookOpen, Target, CheckCircle, ThumbsUp, ThumbsDown, Share, TrendingUp, ExpandIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { LoadingModal } from "@/components/ui/loading-modal";
import { JsonViewer } from "@/components/ui/json-viewer";
import { useToast } from "@/hooks/use-toast";
import { generateResponse, getRecentPrompts } from "@/lib/api";
import type { GenerateRequest } from "@shared/schema";

const MODELS = [
  { value: "openai/gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { value: "mistralai/mistral-7b-instruct", label: "Mistral 7B" },
  { value: "mistralai/mixtral-8x7b-instruct", label: "Mixtral 8x7B" },
];

const PROMPT_TYPES = [
  { value: "zero-shot", label: "Zero-shot", description: "Direct prompt without examples or reasoning steps." },
  { value: "few-shot", label: "Few-shot", description: "Includes examples to guide the model's response." },
  { value: "chain-of-thought", label: "Chain-of-thought", description: "Encourages step-by-step reasoning." },
];

export default function Playground() {
  const [prompt, setPrompt] = useState("");
  const [promptType, setPromptType] = useState<"zero-shot" | "few-shot" | "chain-of-thought">("zero-shot");
  const [model, setModel] = useState("openai/gpt-3.5-turbo");
  const [compareModel, setCompareModel] = useState("none");
  const [temperature, setTemperature] = useState([0.7]);
  const [maxTokens, setMaxTokens] = useState(500);
  const [isGenerating, setIsGenerating] = useState(false);
  const [jsonViewerOpen, setJsonViewerOpen] = useState(false);
  const [jsonData, setJsonData] = useState(null);
  const [responses, setResponses] = useState<any>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: recentPrompts = [] } = useQuery({
    queryKey: ["/api/prompts/recent"],
    queryFn: () => getRecentPrompts(10),
  });

  const generateMutation = useMutation({
    mutationFn: generateResponse,
    onSuccess: (data) => {
      setResponses(data);
      queryClient.invalidateQueries({ queryKey: ["/api/prompts/recent"] });
      toast({
        title: "Response generated",
        description: "Your prompt has been processed successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate response",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsGenerating(false);
    },
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a prompt before generating.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setResponses(null);

    const request: GenerateRequest = {
      prompt,
      promptType,
      model,
      temperature: temperature[0],
      maxTokens,
      compareModel: compareModel !== "none" ? compareModel : undefined,
    };

    generateMutation.mutate(request);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Response has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleViewJson = (data: any) => {
    setJsonData(data);
    setJsonViewerOpen(true);
  };

  const selectedPromptType = PROMPT_TYPES.find(pt => pt.value === promptType);

  return (
    <div className="min-h-screen bg-neutral-light">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-semibold text-gray-900">Prompt Engineering Playground</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <History className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Model Selection */}
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      {MODELS.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Prompt Type Selection */}
                <div>
                  <Label htmlFor="promptType">Prompt Type</Label>
                  <Select value={promptType} onValueChange={(value: any) => setPromptType(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select prompt type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROMPT_TYPES.map((pt) => (
                        <SelectItem key={pt.value} value={pt.value}>
                          {pt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Prompt Type Info */}
                {selectedPromptType && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <BookOpen className="h-4 w-4 text-blue-500 mt-0.5 mr-2" />
                      <div>
                        <h3 className="text-sm font-medium text-blue-900 mb-1">
                          {selectedPromptType.label}
                        </h3>
                        <p className="text-sm text-blue-700">
                          {selectedPromptType.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Comparison Model */}
                <div>
                  <Label htmlFor="compareModel">Compare With (Optional)</Label>
                  <Select value={compareModel} onValueChange={setCompareModel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select comparison model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {MODELS.filter(m => m.value !== model).map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Parameters */}
                <div>
                  <Label htmlFor="temperature">Temperature</Label>
                  <Slider
                    value={temperature}
                    onValueChange={setTemperature}
                    min={0}
                    max={1}
                    step={0.1}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span className="font-medium">{temperature[0]}</span>
                    <span>1</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="maxTokens">Max Tokens</Label>
                  <Input
                    type="number"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    min={1}
                    max={4000}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Recent Prompts */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Recent Prompts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentPrompts.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No recent prompts found
                    </p>
                  ) : (
                    recentPrompts.map((recentPrompt: any) => (
                      <div
                        key={recentPrompt.id}
                        className="p-3 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => setPrompt(recentPrompt.content)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-medium ${
                            recentPrompt.promptType === 'zero-shot' ? 'text-primary' :
                            recentPrompt.promptType === 'few-shot' ? 'text-secondary' :
                            'text-accent'
                          }`}>
                            {recentPrompt.promptType}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(recentPrompt.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 truncate">
                          {recentPrompt.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Workspace */}
          <div className="lg:col-span-3">
            {/* Prompt Input */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Prompt Input</CardTitle>
                  <Button variant="ghost" size="sm">
                    <ExpandIcon className="h-4 w-4 mr-1" />
                    Expand
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Textarea
                    placeholder="Enter your prompt here..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[160px] resize-none"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={handleGenerate}
                      disabled={isGenerating || !prompt.trim()}
                      className="bg-primary hover:bg-blue-600 text-white"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Generate Response
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(prompt)}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </div>
                  <div className="text-sm text-gray-500">
                    {prompt.length} characters
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Response Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Primary Response */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Response</CardTitle>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {MODELS.find(m => m.value === model)?.label}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => responses?.primaryResponse && handleCopy(responses.primaryResponse.content)}
                          disabled={!responses?.primaryResponse}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="bg-gray-50 rounded-md p-4 min-h-[192px]">
                      {responses?.primaryResponse ? (
                        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {responses.primaryResponse.content}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-center">
                          <div>
                            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500">Click "Generate Response" to see results</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span>
                        <Clock className="h-4 w-4 mr-1 inline" />
                        {responses?.primaryResponse ? 
                          `${(responses.primaryResponse.duration / 1000).toFixed(1)}s` : 
                          '-'
                        }
                      </span>
                      <span>
                        <DollarSign className="h-4 w-4 mr-1 inline" />
                        {responses?.primaryResponse ? 
                          `$${(responses.primaryResponse.cost / 1000000).toFixed(4)}` : 
                          '-'
                        }
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => responses?.primaryResponse && handleViewJson(responses.primaryResponse.metadata)}
                      disabled={!responses?.primaryResponse}
                      className="text-primary hover:text-blue-600"
                    >
                      <Code className="h-4 w-4 mr-1" />
                      View JSON
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Comparison Response */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Comparison</CardTitle>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {compareModel ? MODELS.find(m => m.value === compareModel)?.label : 'None'}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => responses?.compareResponse && handleCopy(responses.compareResponse.content)}
                          disabled={!responses?.compareResponse}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="bg-gray-50 rounded-md p-4 min-h-[192px]">
                      {responses?.compareResponse ? (
                        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {responses.compareResponse.content}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-center">
                          <div>
                            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500">
                              {compareModel ? 
                                'Click "Generate Response" to see comparison' : 
                                'Select a comparison model to compare responses'
                              }
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span>
                        <Clock className="h-4 w-4 mr-1 inline" />
                        {responses?.compareResponse ? 
                          `${(responses.compareResponse.duration / 1000).toFixed(1)}s` : 
                          '-'
                        }
                      </span>
                      <span>
                        <DollarSign className="h-4 w-4 mr-1 inline" />
                        {responses?.compareResponse ? 
                          `$${(responses.compareResponse.cost / 1000000).toFixed(4)}` : 
                          '-'
                        }
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => responses?.compareResponse && handleViewJson(responses.compareResponse.metadata)}
                      disabled={!responses?.compareResponse}
                      className={responses?.compareResponse ? "text-primary hover:text-blue-600" : "text-gray-400 cursor-not-allowed"}
                    >
                      <Code className="h-4 w-4 mr-1" />
                      View JSON
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Analysis Panel */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Response Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-blue-900">Readability Score</h4>
                      <BookOpen className="h-4 w-4 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-blue-700">
                      {responses?.primaryResponse ? '8.5/10' : '-'}
                    </p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-green-900">Relevance</h4>
                      <Target className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-green-700">
                      {responses?.primaryResponse ? '9.2/10' : '-'}
                    </p>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-amber-900">Completeness</h4>
                      <CheckCircle className="h-4 w-4 text-amber-500" />
                    </div>
                    <p className="text-2xl font-bold text-amber-700">
                      {responses?.primaryResponse ? '7.8/10' : '-'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Like
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ThumbsDown className="h-4 w-4 mr-1" />
                      Dislike
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-blue-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Detailed Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <LoadingModal open={isGenerating} onOpenChange={setIsGenerating} />
      <JsonViewer 
        open={jsonViewerOpen} 
        onOpenChange={setJsonViewerOpen} 
        data={jsonData} 
      />
    </div>
  );
}
