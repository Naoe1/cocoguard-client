import { Button } from '@/shared/components/ui/button';
import { useDeleteProduct } from '../api/DeleteProduct';
import { toast } from 'sonner';

export const DeleteProduct = ({ productId, productName, closeForm }) => {
  const deleteProductMutation = useDeleteProduct({
    mutationConfig: {
      onSuccess: () => {
        closeForm();
        toast.success(`Product "${productName}" deleted successfully`);
      },
      onError: (error) => {
        toast.error(
          `Failed to delete product: ${error.message || 'Server error'}`,
        );
        closeForm();
      },
    },
  });

  return (
    <Button
      onClick={() => deleteProductMutation.mutate(productId)}
      variant="destructive"
      disabled={deleteProductMutation.isPending}
    >
      {deleteProductMutation.isPending ? 'Deleting...' : 'Delete'}
    </Button>
  );
};
