"use client";

import { useState, useEffect } from "react";
import { useDebts, DebtComment } from "@/contexts/debt-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Trash2, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface DebtActivityCommentsProps {
    debtId: string;
    historyId?: string;
}

export function DebtActivityComments({ debtId, historyId }: DebtActivityCommentsProps) {
    const { getDebtComments, addDebtComment, deleteDebtComment } = useDebts();
    const [comments, setComments] = useState<DebtComment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const fetchComments = async () => {
        setLoading(true);
        try {
            const commentsData = await getDebtComments(debtId);
            // Filter by historyId if provided
            const filteredComments = historyId
                ? commentsData.filter(c => c.debt_history_id === historyId)
                : commentsData;
            setComments(filteredComments);
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [debtId, historyId]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            await addDebtComment(debtId, newComment, historyId);
            setNewComment("");
            // Refresh comments
            await fetchComments();
        } catch (error) {
            console.error("Error adding comment:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            await deleteDebtComment(commentId);
            // Refresh comments
            await fetchComments();
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    {historyId ? "Activity Comments" : "Debt Comments"}
                </CardTitle>
                <CardDescription>
                    {historyId
                        ? "Comments on this specific activity"
                        : "General comments about this debt"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex space-x-2">
                        <Textarea
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="resize-none"
                        />
                        <Button
                            onClick={handleAddComment}
                            disabled={!newComment.trim() || submitting}
                            size="icon"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>

                    {loading ? (
                        <p className="text-center text-sm text-slate-500 py-4">Loading comments...</p>
                    ) : comments.length === 0 ? (
                        <p className="text-center text-sm text-slate-500 py-4">No comments yet</p>
                    ) : (
                        <div className="space-y-3 max-h-[300px] overflow-y-auto">
                            {comments.map((comment) => (
                                <div key={comment.id} className="p-3 bg-slate-50 rounded-md">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <p className="text-sm whitespace-pre-wrap">{comment.comment}</p>
                                            <p className="text-xs text-slate-500">
                                                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteComment(comment.id)}
                                            className="h-6 w-6 text-slate-400 hover:text-red-500"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
} 