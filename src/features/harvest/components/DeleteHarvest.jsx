import { Button } from '@/shared/components/ui/button';
import { useDeleteHarvest } from '../api/DeleteHarvest';
import { toast } from 'sonner';

export const DeleteHarvest = ({ harvestId, setIsDeleteOpen }) => {
  const deleteHarvestMutation = useDeleteHarvest({
    mutationConfig: {
      onSuccess: () => {
        toast.success('Harvest deleted successfully');
      },
    },
  });

  return (
    <Button
      onClick={() => deleteHarvestMutation.mutate(harvestId)}
      variant="destructive"
      disabled={deleteHarvestMutation.isPending}
    >
      Delete
    </Button>
  );
};
