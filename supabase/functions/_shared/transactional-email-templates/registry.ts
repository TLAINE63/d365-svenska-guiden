import type * as React from 'npm:react@18.3.1';

export interface TemplateEntry {
  component: React.ComponentType<any>;
  subject: string | ((data: Record<string, any>) => string);
  displayName?: string;
  previewData?: Record<string, any>;
  to?: string;
}
// Business sends retain their existing attachment-capable delivery until explicitly migrated.
export const TEMPLATES: Record<string, TemplateEntry> = {};