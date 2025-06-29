import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Download, Upload, Save, Settings } from 'lucide-react';
import { CodeExecutionResult, CodeTemplate } from '../types';
import toast from 'react-hot-toast';

const CodeCompiler: React.FC = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<CodeExecutionResult | null>(null);

  const codeTemplates: Record<string, CodeTemplate> = {
    javascript: {
      language: 'javascript',
      name: 'JavaScript',
      template: `// JavaScript code template
function solution() {
    // Your solution here
    console.log("Hello, LeetCode!");
}

// Test cases
solution();
`
    },
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
    setIsRunning(true);
    setOutput('Running...\n');
    
    try {
      // Simulate code execution (in a real app, you'd send to a backend)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let result: CodeExecutionResult;
      
      switch (language) {
        case 'javascript':
          try {
            // Create a safe execution environment
            const safeEval = new Function('console', code);
            let consoleOutput = '';
            const mockConsole = {
              log: (...args: any[]) => {
                consoleOutput += args.join(' ') + '\n';
              }
            };
            
            safeEval(mockConsole);
            result = {
              success: true,
              output: consoleOutput || 'Code executed successfully',
              executionTime: Math.random() * 100 + 50,
              memoryUsage: Math.random() * 10 + 5
            };
          } catch (error) {
            result = {
              success: false,
              output: '',
              error: error instanceof Error ? error.message : 'Unknown error'
            };
          }
          break;
          
        case 'python':
          // Simulate Python execution
          result = {
            success: true,
            output: 'Hello, LeetCode!\n',
            executionTime: Math.random() * 100 + 50,
            memoryUsage: Math.random() * 10 + 5
          };
          break;
          
        default:
          result = {
            success: true,
            output: 'Code executed successfully\n',
            executionTime: Math.random() * 100 + 50,
            memoryUsage: Math.random() * 10 + 5
          };
      }
      
      setExecutionResult(result);
      setOutput(result.success ? result.output : `Error: ${result.error}\n`);
      
      if (result.success) {
        toast.success('Code executed successfully!');
      } else {
        toast.error('Code execution failed!');
      }
    } catch (error) {
      setExecutionResult({
        success: false,
        output: '',
        error: 'Execution failed'
      });
      setOutput('Execution failed\n');
      toast.error('Code execution failed!');
    } finally {
      setIsRunning(false);
    }
  };

  const saveCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solution.${language}`;
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
            <p className="text-gray-600 mt-2">Write, test, and debug your solutions</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="input w-40"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
            
            <button
              onClick={executeCode}
              disabled={isRunning}
              className="btn btn-primary flex items-center"
            >
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? 'Running...' : 'Run'}
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
                accept=".js,.py,.java,.cpp,.txt"
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
                  <span className="font-medium">{executionResult.executionTime?.toFixed(2)}ms</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Memory Usage:</span>
                  <span className="font-medium">{executionResult.memoryUsage?.toFixed(2)}MB</span>
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