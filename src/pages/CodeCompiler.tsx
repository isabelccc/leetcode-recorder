import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Download, Upload, Save, Settings } from 'lucide-react';
import { CodeExecutionResult, CodeTemplate } from '../types';
import toast from 'react-hot-toast';

// Judge0 API configuration
const JUDGE0_API_URL = (import.meta as any).env?.VITE_JUDGE0_API_URL || 
  `https://${(import.meta as any).env?.VITE_JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com'}`;

// Language mapping for Judge0
const languageMapping: Record<string, { id: number; name: string; extension: string }> = {
  python: { id: 71, name: 'Python (3.8.1)', extension: 'py' },
  java: { id: 62, name: 'Java (OpenJDK 13.0.1)', extension: 'java' },
  cpp: { id: 54, name: 'C++ (GCC 9.2.0)', extension: 'cpp' },
  // Alternative C++ IDs if 54 doesn't work
  // cpp: { id: 50, name: 'C (GCC 9.2.0)', extension: 'c' },
  // cpp: { id: 52, name: 'C++ (GCC 9.2.0)', extension: 'cpp' },
};

const CodeCompiler: React.FC = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<CodeExecutionResult | null>(null);

  // Test API connectivity
  const testAPI = async () => {
    const apiKey = (import.meta as any).env?.VITE_RAPIDAPI_KEY;
    if (!apiKey) {
      toast.error('No API key found');
      return;
    }

    try {
      console.log('Testing API connectivity...');
      
      // Test the languages endpoint first
      const languagesResponse = await fetch(`${JUDGE0_API_URL}/languages`, {
        headers: {
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          'X-RapidAPI-Key': apiKey,
        }
      });

      console.log('Languages response status:', languagesResponse.status);
      
      if (languagesResponse.ok) {
        const languages = await languagesResponse.json();
        console.log('Available languages:', languages);
        toast.success('API is working! Check console for languages.');
      } else {
        const errorText = await languagesResponse.text();
        console.error('Languages API error:', errorText);
        toast.error('API test failed');
      }
    } catch (error) {
      console.error('API test error:', error);
      toast.error('API test failed');
    }
  };

  const codeTemplates: Record<string, CodeTemplate> = {
    python: {
      language: 'python',
      name: 'Python',
      template: `# Python code template
def solution():
    # Your solution here
    print("Hello, LeetCode!")

# Test cases
if __name__ == "__main__":
    solution()
`
    },
    java: {
      language: 'java',
      name: 'Java',
      template: `// Java code template
public class Solution {
    public static void main(String[] args) {
        // Your solution here
        System.out.println("Hello, LeetCode!");
    }
}
`
    },
    cpp: {
      language: 'cpp',
      name: 'C++',
      template: `// C++ code template
#include <iostream>
using namespace std;

int main() {
    // Your solution here
    cout << "Hello, LeetCode!" << endl;
    return 0;
}
`
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    if (codeTemplates[newLanguage]) {
      setCode(codeTemplates[newLanguage].template);
    }
  };

  const executeCode = async () => {
    if (!code.trim()) {
      toast.error('Please enter some code to execute');
      return;
    }

    // Check if API key is available
    const apiKey = (import.meta as any).env?.VITE_RAPIDAPI_KEY;
    console.log('API Key available:', !!apiKey);
    console.log('API URL:', JUDGE0_API_URL);
    
    if (!apiKey) {
      toast.error('RapidAPI key not configured. Please check your .env file.');
      console.log('No API key found, using mock execution');
      await mockExecution();
      return;
    }

    setIsRunning(true);
    setOutput('Compiling and running code...\n');
    
    try {
      const languageInfo = languageMapping[language];
      if (!languageInfo) {
        throw new Error(`Unsupported language: ${language}`);
      }

      console.log('Attempting to execute code with language:', languageInfo.name);
      console.log('Code length:', code.length);

      // Step 1: Submit code to Judge0
      const requestBody = {
        source_code: code,
        language_id: languageInfo.id,
        stdin: '',
        expected_output: null,
        cpu_time_limit: 5,
        memory_limit: 512000,
        enable_network: false
      };
      
      console.log('Request body:', requestBody);

      const submitResponse = await fetch(`${JUDGE0_API_URL}/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          'X-RapidAPI-Key': apiKey,
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Submit response status:', submitResponse.status);
      console.log('Submit response headers:', Object.fromEntries(submitResponse.headers.entries()));

      if (!submitResponse.ok) {
        const errorText = await submitResponse.text();
        console.error('Judge0 submission error:', submitResponse.status, errorText);
        
        // Fallback to mock execution if API fails
        console.log('Falling back to mock execution...');
        await mockExecution();
        return;
      }

      const submission = await submitResponse.json();
      const token = submission.token;
      console.log('Code submitted successfully, token:', token);

      // Step 2: Poll for results
      let result = null;
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds timeout

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        
        const resultResponse = await fetch(`${JUDGE0_API_URL}/submissions/${token}`, {
          headers: {
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            'X-RapidAPI-Key': apiKey,
          }
        });

        if (!resultResponse.ok) {
          const errorText = await resultResponse.text();
          console.error('Judge0 result error:', resultResponse.status, errorText);
          throw new Error(`Failed to get result: ${resultResponse.status} - ${errorText}`);
        }

        result = await resultResponse.json();
        console.log('Poll result:', result.status?.id, result.status?.description);
        
        // Check if execution is complete
        if (result.status && result.status.id > 2) {
          break;
        }
        
        attempts++;
      }

      if (!result) {
        throw new Error('Execution timeout');
      }

      // Step 3: Process the result
      const statusId = result.status?.id;
      let executionResult: CodeExecutionResult;

      if (statusId === 3) {
        // Accepted
        executionResult = {
          success: true,
          output: result.stdout || 'Code executed successfully',
          executionTime: result.time || 0,
          memoryUsage: result.memory || 0
        };
        setOutput(executionResult.output);
        toast.success('Code executed successfully!');
      } else {
        // Error or other status
        let errorMessage = '';
        if (result.stderr) {
          errorMessage = result.stderr;
        } else if (result.compile_output) {
          errorMessage = result.compile_output;
        } else {
          errorMessage = result.status?.description || 'Execution failed';
        }

        executionResult = {
          success: false,
          output: '',
          error: errorMessage
        };
        setOutput(`Error: ${errorMessage}`);
        toast.error('Code execution failed!');
      }

      setExecutionResult(executionResult);
      
    } catch (error) {
      console.error('Code execution error:', error);
      
      // Fallback to mock execution on any error
      console.log('Error occurred, falling back to mock execution...');
      await mockExecution();
    } finally {
      setIsRunning(false);
    }
  };

  // Mock execution for testing and fallback
  const mockExecution = async () => {
    try {
      console.log('Running mock execution...');
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let mockOutput = '';
      
      // Simple mock execution based on language
      if (language === 'python') {
        if (code.includes('print(')) {
          mockOutput = 'Hello, LeetCode!\n';
        } else {
          mockOutput = 'Code executed successfully (mock)\n';
        }
      } else if (language === 'java') {
        if (code.includes('System.out.println')) {
          mockOutput = 'Hello, LeetCode!\n';
        } else {
          mockOutput = 'Code executed successfully (mock)\n';
        }
      } else if (language === 'cpp') {
        if (code.includes('cout')) {
          mockOutput = 'Hello, LeetCode!\n';
        } else {
          mockOutput = 'Code executed successfully (mock)\n';
        }
      }
      
      const executionResult: CodeExecutionResult = {
        success: true,
        output: mockOutput,
        executionTime: 0.5,
        memoryUsage: 1024
      };
      
      setOutput(mockOutput);
      setExecutionResult(executionResult);
      toast.success('Code executed successfully! (Mock mode)');
      
    } catch (error) {
      console.error('Mock execution error:', error);
      setOutput('Error: Mock execution failed');
      toast.error('Execution failed');
    }
  };

  const saveCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const extension = languageMapping[language]?.extension || language;
    a.download = `solution.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Code saved successfully!');
  };

  const loadCode = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCode(e.target?.result as string);
        toast.success('Code loaded successfully!');
      };
      reader.readAsText(file);
    }
  };

  const clearCode = () => {
    setCode('');
    setOutput('');
    setExecutionResult(null);
    toast.success('Code cleared!');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Code Compiler</h1>
            <p className="text-gray-600 mt-2">Write, test, and debug your solutions with Judge0</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="input w-40"
            >
              {Object.entries(languageMapping).map(([key, lang]) => (
                <option key={key} value={key}>
                  {lang.name}
                </option>
              ))}
            </select>
            
            <button
              onClick={executeCode}
              disabled={isRunning}
              className="btn btn-primary flex items-center"
            >
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? 'Running...' : 'Run'}
            </button>
            
            <button
              onClick={mockExecution}
              disabled={isRunning}
              className="btn btn-secondary flex items-center"
            >
              <Settings className="w-4 h-4 mr-2" />
              Test Mock
            </button>
            
            <button
              onClick={testAPI}
              disabled={isRunning}
              className="btn btn-secondary flex items-center"
            >
              <Settings className="w-4 h-4 mr-2" />
              Test API
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Code Editor</h3>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept=".js,.py,.java,.cpp,.c,.cs,.go,.rs,.ts,.php,.rb,.swift,.kt,.scala,.r,.dart,.txt"
                onChange={loadCode}
                className="hidden"
                id="load-code"
              />
              <label htmlFor="load-code" className="btn btn-secondary flex items-center cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Load
              </label>
              <button
                onClick={saveCode}
                className="btn btn-secondary flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Save
              </button>
              <button
                onClick={clearCode}
                className="btn btn-secondary flex items-center"
              >
                Clear
              </button>
            </div>
          </div>
          
          <div className="flex-1">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
        </div>

        {/* Output Panel */}
        <div className="w-96 flex flex-col border-l border-gray-200">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Output</h3>
          </div>
          
          <div className="flex-1 p-4">
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg h-full overflow-auto font-mono text-sm">
              <pre>{output || 'Output will appear here...'}</pre>
            </div>
            
            {executionResult && executionResult.success && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Execution Time:</span>
                  <span className="font-medium">
                    {typeof executionResult.executionTime === 'number'
                      ? executionResult.executionTime.toFixed(2) + 'ms'
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Memory Usage:</span>
                  <span className="font-medium">
                    {typeof executionResult.memoryUsage === 'number'
                      ? executionResult.memoryUsage.toFixed(2) + 'KB'
                      : 'N/A'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeCompiler; 