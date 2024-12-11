import React, { useState, useRef, useEffect } from 'react';
import { Upload, Search, FileText, Globe, Loader, X, ChevronDown, 
         AlertCircle, Download, Menu, Settings } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// LoadingOverlay Component
const LoadingOverlay = ({ message }) => (
  <div className="fixed inset-0 bg-[#15131D]/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-[#211F2D] rounded-xl p-8 flex flex-col items-center space-y-4 border border-[#2D2B3C]">
      <Loader className="w-10 h-10 text-[#7C56FF] animate-spin" />
      <p className="text-lg font-medium text-white">{message}</p>
    </div>
  </div>
);

// Header Component
const Header = ({ showSidebar, onToggleSidebar, query, onQueryChange, onSearch, loading }) => (
  <header className="fixed top-0 right-0 h-16 bg-[#1A1825] border-b border-[#2D2B3C] z-20 
                     transition-all duration-500 ease-out"
          style={{ left: showSidebar ? '320px' : '0' }}>
    <div className="flex items-center justify-between h-full px-6">
      <div className="flex items-center">
        {!showSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-[#2D2B3C] rounded-lg transition-colors duration-200 mr-4"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
        )}
        <h1 className="text-xl font-semibold text-white">Zenit Agent</h1>
      </div>

      <div className="flex-1 max-w-3xl mx-8">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !loading && onSearch()}
              placeholder="What insights would you like to discover from your data?"
              className="w-full px-4 py-2 bg-[#211F2D] border border-[#2D2B3C] rounded-lg 
                       text-white placeholder-gray-500 focus:outline-none focus:border-[#7C56FF] 
                       transition-colors duration-300 text-base"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <button 
            onClick={onSearch}
            disabled={loading}
            className="px-6 py-2 bg-[#7C56FF] text-white rounded-lg font-medium
                     hover:bg-[#9B7AFF] disabled:opacity-50 disabled:cursor-not-allowed 
                     transition-colors duration-200 min-w-[120px] text-base flex items-center justify-center"
          >
            {loading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              'Generate Report'
            )}
          </button>
        </div>
      </div>

      <button className="p-2 hover:bg-[#2D2B3C] rounded-lg transition-colors duration-200">
        <Settings className="w-5 h-5 text-white" />
      </button>
    </div>
  </header>
);

// Main App Component
const ReportGenApp = () => {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [urls, setUrls] = useState('');
  const [query, setQuery] = useState('');
  const [report, setReport] = useState('');
  const [sources, setSources] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [showSources, setShowSources] = useState(false);
  const [plotPath, setPlotPath] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isAppMounted, setIsAppMounted] = useState(false);

  useEffect(() => {
    setIsAppMounted(true);
  }, []);

  const handleFileUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
    setError(null);
  };

  const handleProcess = async () => {
    if (files.length === 0 && !urls.trim()) {
      setError('Please upload files or enter URLs');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      formData.append('urls', urls);

      const response = await fetch('https://bee-crack-shepherd.ngrok-free.app/process', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to process documents');

    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a question');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setReport('');
    setSources([]);
    setPlotPath(null);

    try {
      const response = await fetch('https://bee-crack-shepherd.ngrok-free.app/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate report');

      setReport(data.report);
      setSources(data.sources || []);
      setPlotPath(data.plot_path);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const exportReport = async (format) => {
    if (!report) return;

    try {
      const response = await fetch(`https://bee-crack-shepherd.ngrok-free.app/report/${format}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report, plotPath }),
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setError(`Error exporting ${format} report`);
    }
  };

  return (
    <div className={`min-h-screen bg-[#15131D] font-inter transition-opacity duration-500 
                     ${isAppMounted ? 'opacity-100' : 'opacity-0'}`}>
      <Header 
        showSidebar={showSidebar} 
        onToggleSidebar={() => setShowSidebar(true)}
        query={query}
        onQueryChange={setQuery}
        onSearch={handleSearch}
        loading={isGenerating}
      />

      <aside className={`fixed top-0 left-0 h-full w-80 bg-[#1A1825] transform transition-transform 
                        duration-500 ease-out ${showSidebar ? 'translate-x-0' : '-translate-x-full'} 
                        z-30 border-r border-[#2D2B3C]`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-[#2D2B3C]">
            <h2 className="text-xl font-bold text-white">Knowledgebase</h2>
            <button 
              onClick={() => setShowSidebar(false)}
              className="p-2 hover:bg-[#2D2B3C] rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current.click()}
                className="relative group border-2 border-dashed border-[#2D2B3C] hover:border-[#7C56FF] 
                           rounded-xl p-8 transition-all duration-300 cursor-pointer bg-[#211F2D]/40 
                           hover:bg-[#211F2D]/60"
              >
                <input
                  type="file"
                  multiple
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".txt,.pdf,.docx,.json,.xlsx,.csv"
                />
                <div className="text-center transform transition-transform duration-300 group-hover:scale-105">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-[#7C56FF] group-hover:text-[#9B7AFF]" />
                  <p className="text-base font-medium text-white mb-2">Drop files here or click to upload</p>
                  <p className="text-sm text-gray-400">PDF, DOCX, TXT, JSON, XLSX, CSV</p>
                </div>
              </div>

              {files.length > 0 && (
                <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 rounded-lg">
                  {files.map((file, index) => (
                    <div key={index} 
                         className="flex items-center justify-between bg-[#211F2D] rounded-lg p-4 
                                    border border-[#2D2B3C] hover:border-[#7C56FF]/50 transition-all 
                                    duration-300"
                    >
                      <div className="flex items-center space-x-3 truncate">
                        <FileText className="w-5 h-5 text-[#7C56FF] flex-shrink-0" />
                        <span className="text-sm font-medium text-white truncate">{file.name}</span>
                      </div>
                      <button 
                        onClick={() => setFiles(prev => prev.filter((_, i) => i !== index))}
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 
                                  rounded-lg transition-colors duration-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-white mb-2">
                <Globe className="w-5 h-5 text-[#7C56FF]" />
                <h3 className="text-base font-medium">External URLs</h3>
              </div>
              <textarea
                value={urls}
                onChange={(e) => setUrls(e.target.value)}
                placeholder="Enter URLs (one per line)"
                className="w-full min-h-[120px] px-4 py-3 bg-[#211F2D] border border-[#2D2B3C] 
                         rounded-xl text-white placeholder-gray-500 focus:outline-none 
                         focus:border-[#7C56FF] transition-colors duration-300 resize-none"
              />
            </div>
          </div>

          <div className="p-6 border-t border-[#2D2B3C]">
            <button
              onClick={handleProcess}
              disabled={isProcessing}
              className="w-full px-4 py-3 bg-[#7C56FF] text-white rounded-xl font-medium
                       hover:bg-[#9B7AFF] disabled:opacity-50 disabled:cursor-not-allowed 
                       transition-colors duration-200"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                'Process Documents'
              )}
            </button>
          </div>
        </div>
      </aside>

      <main className={`transition-all duration-500 pt-24`}
            style={{ marginLeft: showSidebar ? '320px' : '0' }}>
        <div className="container mx-auto px-6 py-8 max-w-5xl">
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500 text-red-400 px-6 py-4 
                          rounded-xl flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {report && (
            <div className="bg-[#211F2D] border border-[#2D2B3C] rounded-xl overflow-hidden shadow-lg">
              <div className="p-6 border-b border-[#2D2B3C] bg-[#1A1825]">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Generated Report</h2>
                  <button
                    onClick={() => exportReport('html')}
                    className="flex items-center space-x-2 px-4 py-2 bg-[#7C56FF] text-white 
                             rounded-lg hover:bg-[#9B7AFF] transition-colors duration-200"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export HTML</span>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {plotPath && (
                  <div className="rounded-xl overflow-hidden border border-[#2D2B3C] bg-[#1A1825] p-4">
                    <img 
                      src={`https://bee-crack-shepherd.ngrok-free.app${plotPath}`} 
                      alt="Analysis Graph" 
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                )}
                
                <div className="prose prose-invert prose-lg max-w-none text-white">
                  <ReactMarkdown>{report}</ReactMarkdown>
                </div>

                {sources.length > 0 && (
                  <div className="pt-6 border-t border-[#2D2B3C]">
                    <button
                      onClick={() => setShowSources(!showSources)}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white 
                               rounded-lg hover:bg-[#2D2B3C] transition-colors duration-200"
                    >
                      <ChevronDown className={`w-5 h-5 transition-transform duration-300 
                                             ${showSources ? 'rotate-180' : ''}`} />
                      <span className="font-medium">{showSources ? 'Hide Sources' : 'Show Sources'}</span>
                    </button>

                    {showSources && (
                      <div className="mt-4 space-y-3">
                        {sources.map((source, index) => (
                          <div key={index} className="bg-[#1A1825] rounded-xl p-5 border border-[#2D2B3C]">
                            <p className="text-base font-medium text-[#7C56FF] mb-3">Source: {source.source}</p>
                            <p className="text-sm leading-relaxed text-white">{source.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Loading overlays */}
      {isProcessing && (
        <LoadingOverlay message="Processing Documents..." />
      )}
      
      {isGenerating && (
        <LoadingOverlay message="Generating Report..." />
      )}
    </div>
  );
};

export default ReportGenApp;
