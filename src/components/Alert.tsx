import { ReactNode } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose?: () => void;
}

const Alert = ({ type, message, onClose }: AlertProps) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
    warning: AlertTriangle,
  };

  const styles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  };

  const Icon = icons[type];

  return (
    <div className={`flex items-center justify-between p-4 rounded-lg border ${styles[type]}`}>
      <div className="flex items-center">
        <Icon className="h-5 w-5 mr-3" />
        <span>{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="ml-4">
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default Alert;
