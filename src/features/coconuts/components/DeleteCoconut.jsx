import { Button } from '@/shared/components/ui/button';
import { useDeleteCoconut } from '../api/DeleteCoconut';
import { toast } from 'sonner';

export const DeleteCoconut = ({ coconutId, setIsDeleteOpen }) => {
  const deleteCoconutMutation = useDeleteCoconut({
    mutationConfig: {
      onSuccess: () => {
        toast.success('Coconut deleted successfully');
      },
    },
  });

  return (
    <Button
      onClick={() => deleteCoconutMutation.mutate(coconutId)}
      variant="destructive"
      disabled={deleteCoconutMutation.isPending}
    >
      Delete
    </Button>
  );
};
