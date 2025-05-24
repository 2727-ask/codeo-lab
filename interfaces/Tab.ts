export interface Tab {
  id: string;
  title: string;
  content: string;
  language: string;
  isDirty: boolean;
  path?: string; // For saved files
}