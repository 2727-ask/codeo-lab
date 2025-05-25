export interface FileStructure {
  label: string
  icon?: string
  defaultExpanded?: boolean
  children?: FileStructure[]
}