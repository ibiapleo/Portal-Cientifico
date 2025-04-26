import { useEffect, useState } from 'react';
import { CommentResponseDTO } from '@/types/comment';
import { resourceService } from '@/services/resourceService';

type Props = {
  materialId: number;
};

export const CommentList = ({ materialId }: Props) => {
  const [comments, setComments] = useState<CommentResponseDTO[]>([]);

  useEffect(() => {
    const loadComments = async () => {
      const data = await resourceService.getComments(materialId);
      setComments(data);
    };
    loadComments();
  }, [materialId]);

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="p-4 border rounded">
          <p className="text-gray-600">{comment.content}</p>
          <div className="text-sm text-gray-500">
            <span>Por usuário {comment.author}</span>
            <span> • {new Date(comment.createdAt).toLocaleDateString()}</span>
            <span> • {comment.likes} curtidas</span>
          </div>
        </div>
      ))}
    </div>
  );
};