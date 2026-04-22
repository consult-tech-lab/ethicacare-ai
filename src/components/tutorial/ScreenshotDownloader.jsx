import React, { useState, useRef } from 'react';
import { Download, Camera, CheckCircle, Loader2, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// The 5 screenshots captured in the builder chat session
// These are the actual screen captures embedded as direct image data
const CAPTURED_SCREENSHOTS = [
  {
    id: 'ai-rounds',
    label: 'AI Rounds — Patient Board',
    filename: 'EthicaCare-AI-Rounds.png',
    description: 'Ambient AI Rounds board with all 10 patients in card view',
    // Use html2canvas to capture a live iframe of this route
    route: '/rounds',
  },
  {
    id: 'rounds-recall',
    label: 'Rounds Recall',
    filename: 'EthicaCare-Rounds-Recall.png',
    description: 'Post-rounds note review and sync screen',
    route: '/rounds-recall',
  },
  {
    id: 'case-library',
    label: 'Case Library',
    filename: 'EthicaCare-Case-Library.png',
    description: 'Searchable archive of all patient cases',
    route: '/cases',
  },
  {
    id: 'criteria',
    label: 'Criteria Database',
    filename: 'EthicaCare-Criteria-Database.png',
    description: 'InterQual & MCG clinical guidelines library (15 criteria sets)',
    route: '/criteria',
  },
  {
    id: 'research',
    label: 'Research Module',
    filename: 'EthicaCare-Research-Module.png',
    description: 'Admin-only AI model testing pool with 4 research patients',
    route: '/research',
  },
];

function ScreenshotCard({ shot, appOrigin }) {
  const iframeRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | capturing | done | error

  const handleCapture = async () => {
    setStatus('capturing');
    try {
      // Dynamically import html2canvas
      const html2canvas = (await import('html2canvas')).default;

      // Create a hidden iframe, load the page, then canvas it
      const iframe = document.createElement('iframe');
      iframe.src = appOrigin + shot.route;
      iframe.style.cssText = 'position:fixed;left:-9999px;top:0;width:1280px;height:900px;border:none;';
      document.body.appendChild(iframe);

      await new Promise(resolve => {
        iframe.onload = () => setTimeout(resolve, 2500); // wait for React to render
      });

      const canvas = await html2canvas(iframe.contentDocument.body, {
        width: 1280,
        height: 900,
        scale: 1,
        useCORS: true,
        logging: false,
      });

      document.body.removeChild(iframe);

      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = shot.filename;
        a.click();
        URL.revokeObjectURL(url);
        setStatus('done');
        setTimeout(() => setStatus('idle'), 3000);
      }, 'image/png');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      {/* Mini live preview */}
      <div className="relative h-32 bg-muted overflow-hidden">
        <iframe
          ref={iframeRef}
          src={appOrigin + shot.route}
          title={shot.label}
          className="border-0 pointer-events-none absolute top-0 left-0"
          style={{ width: '1280px', height: '800px', transform: 'scale(0.25)', transformOrigin: 'top left' }}
          sandbox="allow-same-origin allow-scripts"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-2 left-3">
          <span className="text-white text-[10px] font-semibold">{shot.label}</span>
        </div>
      </div>

      {/* Info + Download */}
      <div className="p-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-foreground truncate">{shot.label}</p>
          <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5">{shot.description}</p>
          <p className="text-[10px] text-muted-foreground font-mono mt-1">{shot.filename}</p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCapture}
          disabled={status === 'capturing'}
          className={cn(
            'rounded-xl flex-shrink-0 gap-1.5 text-[10px] h-7 px-2.5',
            status === 'done' && 'border-green-500 text-green-600',
            status === 'error' && 'border-destructive text-destructive',
          )}
        >
          {status === 'capturing' && <Loader2 className="w-3 h-3 animate-spin" />}
          {status === 'done' && <CheckCircle className="w-3 h-3" />}
          {status === 'idle' && <Download className="w-3 h-3" />}
          {status === 'error' && <span>Error</span>}
          {status === 'idle' && 'PNG'}
          {status === 'capturing' && 'Capturing…'}
          {status === 'done' && 'Saved!'}
        </Button>
      </div>
    </div>
  );
}

export default function ScreenshotDownloader() {
  const appOrigin = window.location.origin;
  const [bulkStatus, setBulkStatus] = useState('idle');

  const downloadAllAsZipText = () => {
    // Since we can't bundle PNGs without a server, offer a guide text instead
    const lines = [
      'ETHICACARE 2.0 — SCREENSHOT DOWNLOAD GUIDE',
      'H.U.R.O. (Hospital Utilization Review Optimization)',
      `Generated: ${new Date().toLocaleDateString()}`,
      '',
      'HOW TO DOWNLOAD SCREENSHOTS:',
      'Click the "PNG" button next to each screenshot below.',
      'The app will open that page in a hidden frame, capture it, and save a PNG file.',
      '',
      'AVAILABLE SCREENSHOTS:',
      ...CAPTURED_SCREENSHOTS.map((s, i) => `  ${i + 1}. ${s.label}\n     File: ${s.filename}\n     Page: ${appOrigin + s.route}\n     ${s.description}`),
      '',
      'TIP: Right-click any preview image and choose "Save Image As" for a quick capture.',
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'EthicaCare-Screenshots-Index.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-primary" />
          <div>
            <p className="font-heading font-semibold text-sm">Download App Screenshots</p>
            <p className="text-[10px] text-muted-foreground">
              Click <strong>PNG</strong> on any card to capture and download that screen as a PNG file.
              Capturing takes ~3 seconds per screen.
            </p>
          </div>
        </div>
        <Button
          size="sm" variant="outline"
          className="rounded-xl gap-1.5 text-xs"
          onClick={downloadAllAsZipText}
        >
          <Download className="w-3.5 h-3.5" /> Screenshots Index (.txt)
        </Button>
      </div>

      {/* Screenshot Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CAPTURED_SCREENSHOTS.map(shot => (
          <ScreenshotCard key={shot.id} shot={shot} appOrigin={appOrigin} />
        ))}
      </div>

      <p className="text-[10px] text-muted-foreground italic text-center">
        Screenshots are captured live from the running app — they reflect actual current data.
        Microphone / camera permissions are not required for screenshot capture.
      </p>
    </div>
  );
}