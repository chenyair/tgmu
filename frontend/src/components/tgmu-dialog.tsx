import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import './tgmu-dialog.scss';
import { IoMdClose } from 'react-icons/io';

interface TgmuDialogProps {
  open: boolean;
  onOpenChange: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const TgmuDialog: React.FC<TgmuDialogProps> = ({ open, onOpenChange, children, style }: TgmuDialogProps) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent" style={style}>
          {children}
          <Dialog.Close>
            <button className="IconButton" aria-label="Close">
              <IoMdClose />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default TgmuDialog;
