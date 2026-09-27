import { Card } from '../../components/ui/Core';
import { Hammer } from 'lucide-react';

export default function PlaceholderPage({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="h-[70vh] flex items-center justify-center">
      <Card className="max-w-md w-full text-center p-12 border-dashed border-4 border-brand-dark/20 bg-brand-sand/50 shadow-none">
        <Hammer className="w-16 h-16 mx-auto mb-6 text-brand-dark/30" />
        <h2 className="text-3xl font-display font-bold uppercase mb-4">{title}</h2>
        <p className="text-gray-500 border-t-2 border-brand-dark/10 pt-4 mt-4">
          {desc}
          <br /><br />
          <span className="text-xs font-mono font-bold bg-brand-dark text-white px-2 py-1 uppercase">Under Construction</span>
        </p>
      </Card>
    </div>
  );
}
