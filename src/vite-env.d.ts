/// <reference types="vite/client" />

interface Window {
  finance?: {
    exportCsv: (csv: string, filename: string) => Promise<{ canceled: boolean; filePath?: string }>;
  };
}
