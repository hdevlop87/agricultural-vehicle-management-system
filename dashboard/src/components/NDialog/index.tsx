'use client'
import React from 'react'
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import ActionButton from '../NButtons/ActionButton'
import { useDialogStore } from '@/stores/DialogStore'

const AsyncDialog = () => {
   const {
      isOpen,
      title,
      description,
      children,
      primaryButton,
      secondaryButton,
      showButtons,
      handlePrimaryClick,
      handleSecondaryClick,
      handleOpenChange,
   } = useDialogStore();

   const noTitle = !title || title.trim() === '';
   const noDescription = !description || description.trim() === '';
   const noHeader = noTitle && noDescription;

   const createButtonHandler = (handler, hasForm) =>
      async (e?) => {
         if (!hasForm && e) {
            e.preventDefault();
         }
         await handler();
      };

   const handlePrimaryAction = createButtonHandler(handlePrimaryClick, !!primaryButton?.form);
   const handleSecondaryAction = createButtonHandler(handleSecondaryClick, !!secondaryButton?.form);

   return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
         <DialogContent className='gap-6 p-4 h-auto max-h-screen lg:max-h-[90%] max-w-screen overflow-auto'>
            <DialogHeader className={cn(noHeader && "sr-only")}>
               <DialogTitle className={cn('text-primary', noTitle && "sr-only")}>
                  {title}
               </DialogTitle>
               <DialogDescription className={cn(noDescription && "sr-only")}>
                  {description}
               </DialogDescription>
            </DialogHeader>

            {children}

            <DialogFooter className={cn(!showButtons && "sr-only")}>
               {secondaryButton && (
                  <ActionButton
                     text={secondaryButton.text}
                     onClick={secondaryButton.form ? undefined : handleSecondaryAction}
                     disabled={secondaryButton.disabled || secondaryButton.loading || false}
                     variant={secondaryButton.variant || "outline"}
                     loading={secondaryButton.loading || false}
                     icon={secondaryButton.icon || "x"}
                     loadingText={secondaryButton.loadingText || "Processing..."}
                     form={secondaryButton.form}
                     className='w-auto'
                  />
               )}

               {primaryButton && (
                  <ActionButton
                     text={primaryButton.text}
                     onClick={primaryButton.form ? undefined : handlePrimaryAction}
                     disabled={primaryButton.disabled || primaryButton.loading || false}
                     variant={primaryButton.variant || "default"}
                     loading={primaryButton.loading || false}
                     icon={primaryButton.icon || "check"}
                     loadingText={primaryButton.loadingText || "Processing..."}
                     form={primaryButton.form} 
                     className='w-auto'
                  />
               )}
            </DialogFooter>
         </DialogContent>
      </Dialog>
   )
}

export default AsyncDialog;