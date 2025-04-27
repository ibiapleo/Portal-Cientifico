import {useState} from 'react';
import {materialService} from '@/services/materialService';

type Props = {
  materialId: number;
  onCommentAdded: () => void;
};

export const CommentForm = ({ materialId, onCommentAdded }: Props) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    await materialService.addComment(materialId, content);
    setContent('');
    onCommentAdded(); // Atualiza a lista de comentários
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Adicione um comentário..."
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Enviar
      </button>
    </form>
  );
};