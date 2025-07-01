import { Button } from '@/shared/components/ui/button';
import { useDeleteNutrient } from '../api/DeleteNutrient';
import { toast } from 'sonner';

export const DeleteNutrient = ({ nutrientId, closeForm }) => {
  const deleteNutrientMutation = useDeleteNutrient({
    mutationConfig: {
      onSuccess: () => {
        closeForm();
        toast.success('Nutrient record deleted successfully');
      },
    },
  });

  return (
    <Button
      onClick={() => deleteNutrientMutation.mutate(nutrientId)}
      variant="destructive"
      disabled={deleteNutrientMutation.isPending}
    >
      Delete
    </Button>
  );
};
