import { Button } from '@/shared/components/ui/button';
import { useDeleteItem } from '../api/DeleteItem';
import { toast } from 'sonner';

export const DeleteItem = ({ itemId, closeForm }) => {
  const deleteItemMutation = useDeleteItem({
    mutationConfig: {
      onSuccess: () => {
        closeForm();
        toast.success('Inventory item deleted successfully');
      },
    },
  });

  return (
    <Button
      onClick={() => deleteItemMutation.mutate(itemId)}
      variant="destructive"
      disabled={deleteItemMutation.isPending}
    >
      Delete
    </Button>
  );
};
