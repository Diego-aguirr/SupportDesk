import { useState } from 'react';
import type { Comment, User } from '@/types';
import { useAddCommentMutation } from '@/features/tickets/ticketsApi';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

interface CommentSectionProps {
  ticketId: number;
  comments: Comment[];
  currentUser: User | null;
}

export function CommentSection({ ticketId, comments, currentUser }: CommentSectionProps) {
  const [content, setContent] = useState('');
  const [addComment, { isLoading }] = useAddCommentMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await addComment({ ticketId: String(ticketId), content: content.trim() }).unwrap();
      setContent('');
      toast.success('Comment added');
    } catch {
      toast.error('Failed to add comment');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-medium text-[var(--color-muted)]">
        Comments ({comments.length})
      </h2>

      {/* Comment list */}
      <div className="space-y-3">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
          >
            <div className="mb-2 flex items-center gap-2">
              <img
                src={comment.author.avatar}
                alt=""
                className="h-6 w-6 rounded-full"
              />
              <span className="text-sm font-medium text-[var(--color-text)]">
                {comment.author.name}
              </span>
              <span className="text-xs text-[var(--color-muted)]">
                {formatDate(comment.createdAt)}
              </span>
            </div>
            <p className="whitespace-pre-wrap text-sm text-[var(--color-text)]">
              {comment.content}
            </p>
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-sm text-[var(--color-muted)] italic">No comments yet</p>
        )}
      </div>

      {/* Add comment form */}
      {currentUser && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-start gap-3">
            <img
              src={currentUser.avatar}
              alt=""
              className="h-8 w-8 rounded-full"
            />
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write a comment..."
                rows={3}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                aria-label="Write a comment"
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={!content.trim() || isLoading}
                  className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? 'Posting...' : 'Post comment'}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
