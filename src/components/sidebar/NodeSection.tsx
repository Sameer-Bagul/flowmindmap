
import { ReactNode } from 'react';

interface NodeSectionProps {
  title: string;
  children: ReactNode;
}

export const NodeSection = ({ title, children }: NodeSectionProps) => {
  return (
    <div className="mb-3">
      <h6 className="text-xs text-white/80 font-semibold mb-2 text-center">{title}</h6>
      {children}
    </div>
  );
};
