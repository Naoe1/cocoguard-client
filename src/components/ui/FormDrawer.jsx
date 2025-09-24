import { useDisclosure } from '@/hooks/use-disclosure';
import { Button } from '@/shared/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
  DrawerTitle,
  DrawerDescription,
} from '@/shared/components/ui/drawer';
import { useEffect } from 'react';
import { X } from 'lucide-react';

export const FormDrawer = ({
  title,
  children,
  description,
  isDone,
  triggerButton,
  submitButton,
}) => {
  const { close, open, isOpen } = useDisclosure();
  useEffect(() => {
    if (isDone) {
      close();
    }
  }, [isDone, close]);

  return (
    <Drawer
      direction="right"
      open={isOpen}
      dismissible={false}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          close();
        } else {
          open();
        }
      }}
    >
      <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
      <DrawerContent className="flex h-screen min-h-0 max-w-[800px] flex-col sm:max-w-[540px] shadow-xl border-l overflow-hidden">
        <div className="flex flex-col relative flex-1 min-h-0 overflow-hidden">
          <DrawerClose asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={close}
              className="absolute right-4 top-4 z-10 h-8 w-8 rounded-full hover:bg-slate-100"
            >
              <X className="h-4 w-4 text-slate-500" />
              <span className="sr-only">Close</span>
            </Button>
          </DrawerClose>
          <DrawerHeader className="border-b pb-4 bg-gradient-to-r from-slate-50 to-white md:p-6">
            <DrawerTitle className="text-xl font-semibold text-slate-800">
              {title}
            </DrawerTitle>
            {description && (
              <DrawerDescription className="text-sm text-slate-500 mt-1">
                {description}
              </DrawerDescription>
            )}
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto p-5 md:p-6 bg-white">
            {children}
          </div>
        </div>
        <DrawerFooter className="border-t pt-4 flex justify-end gap-3 bg-slate-50 px-5 md:px-6 shrink-0">
          <DrawerClose asChild>
            <Button
              variant="outline"
              type="button"
              onClick={close}
              className="border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-800"
            >
              Cancel
            </Button>
          </DrawerClose>
          {submitButton}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
