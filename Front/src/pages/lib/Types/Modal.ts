export interface Modal {
  title: string;
  body?: string;
  cancelMessage?: string;
  confirmMessage?: string;
  color: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}
