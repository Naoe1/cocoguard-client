import { Button } from '@/shared/components/ui/button';
import { useDeleteTreatment } from '../api/DeleteTreatment';
import { toast } from 'sonner';

export const DeleteTreatment = ({ treatmentId, closeForm }) => {
  const deleteTreatmentMutation = useDeleteTreatment({
    mutationConfig: {
      onSuccess: () => {
        closeForm();
        toast.success('Treatment deleted successfully');
      },
    },
  });

  return (
    <Button
      onClick={() => deleteTreatmentMutation.mutate(treatmentId)}
      variant="destructive"
      disabled={deleteTreatmentMutation.isPending}
    >
      Delete
    </Button>
  );
};
