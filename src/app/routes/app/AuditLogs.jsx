import { AuditLogsView } from '@/features/audit/components/AuditLogsView';

export const AuditLogsRoute = () => {
  return (
    <div className="flex flex-col">
      <div className="p-4">
        <AuditLogsView />
      </div>
    </div>
  );
};

export default AuditLogsRoute;
