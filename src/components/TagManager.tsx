import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Sparkles, Loader2, Tag as TagIcon } from 'lucide-react';
import { Button } from './ui/Button';
import { analyzeTaskInput } from '@/lib/claude';
import type { Task } from '@/types';

interface TagManagerProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onUpdateTags: (taskId: string, tags: string[]) => Promise<void>;
}

export const TagManager: React.FC<TagManagerProps> = ({
  isOpen,
  onClose,
  task,
  onUpdateTags,
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(task.tags);
  const [newTag, setNewTag] = useState('');
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Common tags from all tasks (would ideally come from store)
  const commonTags = [
    'bug',
    'feature',
    'refactor',
    'docs',
    'test',
    'urgent',
    'backend',
    'frontend',
    'design',
    'api',
    'database',
    'ui',
    'ux',
  ];

  useEffect(() => {
    setSelectedTags(task.tags);
  }, [task.tags]);

  const handleAutoTag = async () => {
    setIsLoadingSuggestions(true);
    try {
      // Analyze task using Claude AI
      const analysis = await analyzeTaskInput(
        `${task.title}\n${task.description || ''}\nProject: ${task.project || 'none'}`
      );

      // Get suggested tags from AI
      const suggested = analysis.tags.filter(
        (tag: string) => !selectedTags.includes(tag)
      );
      setSuggestedTags(suggested);
    } catch (error) {
      console.error('Error getting tag suggestions:', error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !selectedTags.includes(trimmedTag)) {
      setSelectedTags([...selectedTags, trimmedTag]);
    }
    setNewTag('');
  };

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const addSuggestedTag = (tag: string) => {
    addTag(tag);
    setSuggestedTags(suggestedTags.filter((t) => t !== tag));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdateTags(task.id, selectedTags);
      onClose();
    } catch (error) {
      console.error('Error updating tags:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-light-surface dark:bg-dark-surface rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-light-border dark:border-dark-border">
            <div className="flex items-center gap-3">
              <TagIcon className="w-6 h-6 text-accent-primary" />
              <h2 className="text-xl font-medium">Manage Tags</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-lg transition-smooth"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Task Info */}
            <div className="bg-light-surface-2 dark:bg-dark-surface-2 rounded-lg p-4">
              <h3 className="font-medium mb-1">{task.title}</h3>
              {task.description && (
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  {task.description}
                </p>
              )}
            </div>

            {/* Auto-tag Button */}
            <div>
              <Button
                variant="secondary"
                onClick={handleAutoTag}
                disabled={isLoadingSuggestions}
                className="w-full"
              >
                {isLoadingSuggestions ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Auto-suggest Tags with AI
                  </>
                )}
              </Button>
            </div>

            {/* AI Suggested Tags */}
            {suggestedTags.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  AI Suggestions
                </label>
                <div className="flex flex-wrap gap-2">
                  {suggestedTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => addSuggestedTag(tag)}
                      className="px-3 py-1.5 rounded-lg text-sm bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20 transition-smooth flex items-center gap-2"
                    >
                      <Sparkles className="w-3 h-3" />
                      {tag}
                      <Plus className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Current Tags ({selectedTags.length})
              </label>
              <div className="flex flex-wrap gap-2 min-h-[60px] p-3 rounded-lg border border-light-border dark:border-dark-border bg-light-surface-2 dark:bg-dark-surface-2">
                {selectedTags.length === 0 ? (
                  <div className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                    No tags yet. Add some below or use AI suggestions.
                  </div>
                ) : (
                  selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-accent-primary text-white"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:bg-white/20 rounded p-0.5 transition-smooth"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Add New Tag */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Add New Tag
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag(newTag);
                    }
                  }}
                  placeholder="Type tag name and press Enter"
                  className="input flex-1"
                />
                <Button
                  variant="secondary"
                  onClick={() => addTag(newTag)}
                  disabled={!newTag.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Common Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Quick Add (Common Tags)
              </label>
              <div className="flex flex-wrap gap-2">
                {commonTags
                  .filter((tag) => !selectedTags.includes(tag))
                  .map((tag) => (
                    <button
                      key={tag}
                      onClick={() => addTag(tag)}
                      className="px-3 py-1.5 rounded-lg text-sm bg-light-hover dark:bg-dark-hover hover:bg-accent-primary/20 dark:hover:bg-accent-primary/20 transition-smooth"
                    >
                      {tag}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-light-border dark:border-dark-border">
            <Button variant="secondary" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Tags'
              )}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
