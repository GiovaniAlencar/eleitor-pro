import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          if (isLast) {
            return (
              <span key={index} className="font-medium text-gray-900">
                {item.label}
              </span>
            );
          }

          return (
            <div key={index} className="flex items-center gap-2">
              {item.href ? (
                <Link to={item.href} className="hover:text-gray-900">
                  {item.label}
                </Link>
              ) : (
                <span>{item.label}</span>
              )}
              <ChevronRight className="w-4 h-4" />
            </div>
          );
        })}
      </div>
    </div>
  );
}