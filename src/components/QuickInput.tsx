import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import { analyzeTaskInput } from '@/lib/claude';
import { taskService } from '@/lib/supabase';
import { useTaskStore } from '@/stores/useTaskStore';

export const QuickInput: React.FC = () => {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { addTask } = useTaskStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isAnalyzing) return;

    setIsAnalyzing(true);

    try {
      // AI 분석
      const analysis = await analyzeTaskInput(input);

      // 새 작업 생성
      const newTask = {
        title: input,
        description: analysis.description,
        status: 'pending' as const,
        priority: analysis.priority,
        tags: analysis.tags,
        context: analysis.context,
        project: analysis.project,
        estimated_duration: analysis.estimated_duration,
        ai_analyzed: true,
        source: 'manual' as const,
      };

      // Supabase에 저장
      const savedTask = await taskService.createTask(newTask);

      // 로컬 상태 업데이트
      addTask(savedTask);

      // 입력 초기화
      setInput('');
    } catch (error) {
      console.error('Error creating task:', error);
      // TODO: Show error toast
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What are you working on? (e.g., 'Fix login bug in auth service')"
              className="input w-full"
              disabled={isAnalyzing}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={!input.trim() || isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Add Task
              </>
            )}
          </Button>
        </div>

        {isAnalyzing && (
          <div className="mt-3 text-sm text-light-text-secondary dark:text-dark-text-secondary animate-in">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>AI is analyzing your task and adding tags, priority, and context...</span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
