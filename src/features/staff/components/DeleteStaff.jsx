import { Button } from '@/shared/components/ui/button';
import { useDeleteStaff } from '../api/DeleteStaff';
import { toast } from 'sonner';

export const DeleteStaff = ({ staffId, closeForm }) => {
  const deleteStaffMutation = useDeleteStaff({
    mutationConfig: {
      onSuccess: () => {
        closeForm?.();
        toast.success('Staff member deleted successfully');
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message ||
            'Failed to delete staff member. Please try again.',
        );
      },
    },
  });

  return (
    <Button
      onClick={() => deleteStaffMutation.mutate(staffId)}
      variant="destructive"
      disabled={deleteStaffMutation.isPending}
    >
      {deleteStaffMutation.isPending ? 'Deleting...' : 'Delete'}
    </Button>
  );
};
