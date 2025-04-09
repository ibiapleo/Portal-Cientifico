import React from 'react';
import { BookOpen, FileText } from 'lucide-react';
import MaterialCard from './MaterialCard';
import { Material } from '../../types/material';

interface MaterialGridProps {
  materials: Material[];
  title?: string;
  description?: string;
}

const MaterialGrid: React.FC<MaterialGridProps> = ({ 
  materials, 
  title = "Recursos", 
  description 
}) => {
  // Função para formatar a data
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Função para escolher o ícone baseado no tipo
  const getIconForType = (type: string): React.ReactNode => {
    switch (type.toLowerCase()) {
      case 'article':
      case 'artigo':
      case 'thesis':
      case 'tcc':
        return <FileText className="h-8 w-8 text-orange-500" />;
      default:
        return <BookOpen className="h-8 w-8 text-orange-500" />;
    }
  };

  return (
    <div className="container px-4 md:px-6 py-8">
      {(title || description) && (
        <div className="mb-8">
          {title && <h2 className="text-2xl font-bold tracking-tight">{title}</h2>}
          {description && <p className="text-gray-500 mt-1">{description}</p>}
        </div>
      )}
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {materials.map((material) => (
          <materialCard
            key={material.id}
            id={material.id}
            title={material.title}
            type={material.type}
            subject={material.subject}
            author={material.author}
            date={formatDate(material.createdAt)}
            downloads={material.downloads}
            icon={getIconForType(material.type)}
          />
        ))}
      </div>
      
      {materials.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum recurso encontrado.</p>
        </div>
      )}
    </div>
  );
};

export default MaterialGrid;