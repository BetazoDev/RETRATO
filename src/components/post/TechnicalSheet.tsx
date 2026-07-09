import type { TechnicalSheet as TechnicalSheetType } from '@/lib/types';

interface TechnicalSheetProps {
  sheet: TechnicalSheetType | null | undefined;
}

export default function TechnicalSheet({ sheet }: TechnicalSheetProps) {
  if (!sheet) return null;

  const hasData = sheet.camera || sheet.lens || sheet.filmStock || sheet.year || sheet.location;
  if (!hasData) return null;

  return (
    <div className="max-w-[700px] mx-auto mt-20 relative">
      <div className="bg-[#111] text-white p-8 lg:p-12 rounded relative overflow-hidden group">
        {/* Film grain overlay */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none" 
          style={{
            backgroundImage: `radial-gradient(circle, #333 1px, transparent 1px)`,
            backgroundSize: '4px 4px'
          }}
        />
        
        {/* Perforated Edge Aesthetic */}
        <div className="absolute left-0 top-0 bottom-0 w-4 flex flex-col justify-around py-4 opacity-20">
          <div className="w-2 h-3 bg-white/30 rounded-sm mx-auto"></div>
          <div className="w-2 h-3 bg-white/30 rounded-sm mx-auto"></div>
          <div className="w-2 h-3 bg-white/30 rounded-sm mx-auto"></div>
          <div className="w-2 h-3 bg-white/30 rounded-sm mx-auto"></div>
        </div>

        <h3 className="text-[#e00000] text-[10px] font-black uppercase tracking-[0.4em] mb-8 pl-4">
          Technical Sheet / Metadata
        </h3>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pl-4">
          {sheet.camera && (
            <div className="space-y-1">
              <p className="text-white/40 text-[9px] uppercase tracking-widest font-bold">Camera</p>
              <p className="text-sm font-mono tracking-tight">{sheet.camera}</p>
            </div>
          )}
          
          {sheet.lens && (
            <div className="space-y-1">
              <p className="text-white/40 text-[9px] uppercase tracking-widest font-bold">Lens</p>
              <p className="text-sm font-mono tracking-tight">{sheet.lens}</p>
            </div>
          )}

          {sheet.filmStock && (
            <div className="space-y-1">
              <p className="text-white/40 text-[9px] uppercase tracking-widest font-bold">Film Stock</p>
              <p className="text-sm font-mono tracking-tight">{sheet.filmStock}</p>
            </div>
          )}

          {sheet.year && (
            <div className="space-y-1">
              <p className="text-white/40 text-[9px] uppercase tracking-widest font-bold">Year</p>
              <p className="text-sm font-mono tracking-tight">{sheet.year}</p>
            </div>
          )}
        </div>

        {sheet.location && (
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pl-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#e00000] text-sm">location_on</span>
              <p className="text-xs uppercase tracking-widest font-bold">{sheet.location}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
