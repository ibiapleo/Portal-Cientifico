import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import { ResourceCardProps } from '../../types/resource';

const ResourceCard: React.FC<ResourceCardProps> = ({
  id,
  title,
  type,
  subject,
  author,
  date,
  downloads,
  icon
}) => {
  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md">
      <div className="p-4 pb-0 flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700">
            {type}
          </span>
          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium">
            {subject}
          </span>
        </div>
        <div className="rounded-full bg-orange-50 p-2">
          {icon}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium line-clamp-2 min-h-[48px]">{title}</h3>
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <span>Por {author}</span>
          <span className="mx-2">•</span>
          <span>{date}</span>
        </div>
      </div>
      <div className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <Download className="mr-1 h-4 w-4" />
          <span>{downloads}</span>
        </div>
        <Link 
          to={`/resource/${id}`}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium text-orange-600 hover:bg-orange-50 hover:text-orange-700 h-8 px-3"
        >
          Ver Detalhes
        </Link>
      </div>
    </div>
  );
};

export default ResourceCard;