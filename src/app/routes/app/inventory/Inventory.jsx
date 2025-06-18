import { InventoryView } from '@/features/inventory/components/InventoryView';

const InventoryRoutes = () => {
  return (
    <div className="flex flex-col">
      <div className="p-4">
        <InventoryView />
      </div>
    </div>
  );
};

export default InventoryRoutes;
