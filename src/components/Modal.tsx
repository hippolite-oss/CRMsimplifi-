import { ReactNode, useEffect, useState } from 'react';
import { 
  X, AlertCircle, Check, AlertTriangle, Info, 
  Sparkles, Shield, Lock, Star, Zap, Loader2,
  ChevronRight, ArrowRight, Target, Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onConfirm?: () => void;
  confirmLabel?: string;
  confirmVariant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'gradient' | 'premium';
  cancelLabel?: string;
  showCancel?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
  variant?: 'default' | 'danger' | 'success' | 'warning' | 'info' | 'premium';
  animated?: boolean;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  backdropBlur?: boolean;
  backdropOpacity?: number;
  showHeader?: boolean;
  showFooter?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inner';
  onConfirmLoading?: boolean;
  preventClose?: boolean;
  centerContent?: boolean;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmLabel = 'Confirmer',
  confirmVariant = 'primary',
  cancelLabel = 'Annuler',
  showCancel = true,
  size = 'md',
  variant = 'default',
  animated = true,
  closeOnOverlayClick = true,
  showCloseButton = true,
  loading = false,
  icon,
  backdropBlur = true,
  backdropOpacity = 75,
  showHeader = true,
  showFooter = true,
  rounded = 'lg',
  shadow = 'lg',
  onConfirmLoading = false,
  preventClose = false,
  centerContent = false,
}: ModalProps) => {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setShowContent(true), 50);
    } else {
      setShowContent(false);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleOverlayClick = () => {
    if (closeOnOverlayClick && !preventClose) {
      onClose();
    }
  };

  const handleClose = () => {
    if (!preventClose) {
      onClose();
    }
  };

  const sizes = {
    xs: 'max-w-sm',
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    fullscreen: 'max-w-screen-xl w-full min-h-[90vh]',
  };

  const roundedClasses = {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
    '2xl': 'rounded-[2rem]',
  };

  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
    inner: 'shadow-inner',
  };

  const variantStyles = {
    default: {
      bg: 'bg-white dark:bg-gray-900',
      border: 'border-gray-200 dark:border-gray-700',
      text: 'text-gray-900 dark:text-gray-100',
      icon: <Info className="h-6 w-6 text-blue-500" />,
    },
    danger: {
      bg: 'bg-gradient-to-br from-white to-red-50 dark:from-gray-900 dark:to-red-900/20',
      border: 'border-red-200 dark:border-red-800/50',
      text: 'text-gray-900 dark:text-gray-100',
      icon: <AlertCircle className="h-6 w-6 text-red-500" />,
    },
    success: {
      bg: 'bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-green-900/20',
      border: 'border-green-200 dark:border-green-800/50',
      text: 'text-gray-900 dark:text-gray-100',
      icon: <Check className="h-6 w-6 text-green-500" />,
    },
    warning: {
      bg: 'bg-gradient-to-br from-white to-yellow-50 dark:from-gray-900 dark:to-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800/50',
      text: 'text-gray-900 dark:text-gray-100',
      icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
    },
    info: {
      bg: 'bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800/50',
      text: 'text-gray-900 dark:text-gray-100',
      icon: <Info className="h-6 w-6 text-blue-500" />,
    },
    premium: {
      bg: 'bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-indigo-900/30',
      border: 'border-purple-300 dark:border-purple-700/50',
      text: 'text-gray-900 dark:text-gray-100',
      icon: <Sparkles className="h-6 w-6 text-purple-500" />,
    },
  };

  const currentVariant = variantStyles[variant];

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Overlay avec animation */}
          <motion.div
            initial={animated ? { opacity: 0 } : false}
            animate={animated ? { opacity: 1 } : false}
            exit={animated ? { opacity: 0 } : false}
            transition={{ duration: 0.3 }}
            className={`fixed inset-0 transition-opacity ${
              backdropBlur ? 'backdrop-blur-sm' : ''
            }`}
            style={{ 
              backgroundColor: `rgba(0, 0, 0, ${backdropOpacity/100})` 
            }}
            onClick={handleOverlayClick}
          >
            {/* Effet de particules pour le fond */}
            {variant === 'premium' && (
              <>
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      opacity: [0, 0.5, 0],
                      scale: [0, 1.5, 0],
                      y: [-10, -30],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </>
            )}
          </motion.div>

          <div className="flex items-center justify-center min-h-screen px-4 py-12">
            <motion.div
              initial={animated ? { 
                opacity: 0, 
                scale: 0.9,
                y: 50 
              } : false}
              animate={animated ? { 
                opacity: 1, 
                scale: 1,
                y: 0 
              } : false}
              exit={animated ? { 
                opacity: 0, 
                scale: 0.9,
                y: 50 
              } : false}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                duration: 0.3 
              }}
              className={`relative ${sizes[size]} w-full ${roundedClasses[rounded]} ${shadowClasses[shadow]} ${
                currentVariant.bg
              } border ${currentVariant.border} overflow-hidden`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Effet de brillance pour premium */}
              {variant === 'premium' && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%]"
                  animate={{
                    translateX: ["-200%", "200%"]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                />
              )}

              {/* Bandeau supérieur coloré */}
              <div className={`h-2 ${
                variant === 'danger' ? 'bg-gradient-to-r from-red-500 to-rose-600' :
                variant === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                variant === 'warning' ? 'bg-gradient-to-r from-yellow-500 to-amber-600' :
                variant === 'info' ? 'bg-gradient-to-r from-blue-500 to-cyan-600' :
                variant === 'premium' ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500' :
                'bg-gradient-to-r from-gray-500 to-gray-600'
              }`} />

              <div className={`p-6 ${centerContent ? 'text-center' : ''}`}>
                {/* Header */}
                {showHeader && (
                  <div className={`flex items-start justify-between mb-6 ${centerContent ? 'justify-center' : ''}`}>
                    <div className={`flex items-center gap-3 ${centerContent ? 'flex-col text-center' : ''}`}>
                      {icon || (
                        <motion.div
                          initial={animated ? { scale: 0 } : false}
                          animate={animated ? { scale: 1 } : false}
                          transition={{ delay: 0.1 }}
                          className="p-2 rounded-xl bg-white/80 dark:bg-gray-800/80 shadow-sm border border-gray-200 dark:border-gray-700"
                        >
                          {currentVariant.icon}
                        </motion.div>
                      )}
                      <div>
                        <motion.h3
                          initial={animated ? { opacity: 0, y: -10 } : false}
                          animate={animated ? { opacity: 1, y: 0 } : false}
                          transition={{ delay: 0.15 }}
                          className={`text-xl font-bold ${currentVariant.text} ${centerContent ? 'mt-2' : ''}`}
                        >
                          {title}
                        </motion.h3>
                        {variant === 'premium' && (
                          <motion.div
                            initial={animated ? { opacity: 0 } : false}
                            animate={animated ? { opacity: 1 } : false}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-1 mt-1"
                          >
                            <Sparkles className="h-3 w-3 text-purple-500" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Fonctionnalité premium
                            </span>
                          </motion.div>
                        )}
                      </div>
                    </div>
                    
                    {showCloseButton && (
                      <motion.button
                        initial={animated ? { scale: 0 } : false}
                        animate={animated ? { scale: 1 } : false}
                        whileHover={{ rotate: 90, scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleClose}
                        disabled={preventClose}
                        className={`p-2 rounded-xl transition-colors ${
                          preventClose 
                            ? 'cursor-not-allowed opacity-50' 
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                        title={preventClose ? "Fermeture désactivée" : "Fermer"}
                      >
                        <X className="h-5 w-5" />
                      </motion.button>
                    )}
                  </div>
                )}

                {/* Contenu */}
                <motion.div
                  initial={animated ? { opacity: 0 } : false}
                  animate={animated ? { opacity: 1 } : false}
                  transition={{ delay: 0.2 }}
                  className={`mb-6 ${currentVariant.text} ${loading ? 'opacity-50' : ''}`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 className="h-8 w-8 text-gray-400" />
                      </motion.div>
                    </div>
                  ) : (
                    children
                  )}
                </motion.div>

                {/* Footer */}
                {showFooter && (showCancel || onConfirm) && (
                  <motion.div
                    initial={animated ? { opacity: 0, y: 10 } : false}
                    animate={animated ? { opacity: 1, y: 0 } : false}
                    transition={{ delay: 0.3 }}
                    className={`flex flex-col sm:flex-row gap-3 ${centerContent ? 'justify-center' : 'justify-end'} ${
                      centerContent ? 'sm:flex-col sm:items-center' : ''
                    }`}
                  >
                    {showCancel && (
                      <Button
                        variant="secondary"
                        onClick={handleClose}
                        disabled={preventClose || loading}
                        className="w-full sm:w-auto"
                        animated={animated}
                      >
                        {cancelLabel}
                      </Button>
                    )}
                    
                    {onConfirm && (
                      <Button
                        variant={confirmVariant}
                        onClick={onConfirm}
                        loading={onConfirmLoading}
                        disabled={loading || onConfirmLoading}
                        className="w-full sm:w-auto"
                        animated={animated}
                        icon={variant === 'premium' ? <Sparkles /> : undefined}
                        iconPosition="right"
                        glow={variant === 'premium'}
                      >
                        {confirmLabel}
                      </Button>
                    )}
                  </motion.div>
                )}

                {/* Indicateur de chargement */}
                {loading && (
                  <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
                    >
                      <Loader2 className="h-8 w-8 text-blue-500" />
                    </motion.div>
                  </div>
                )}
              </div>

              {/* Effet de bordure animée */}
              <motion.div
                className="absolute inset-0 border-2 border-transparent pointer-events-none"
                animate={{
                  borderColor: variant === 'premium' 
                    ? ['rgba(168, 85, 247, 0.3)', 'rgba(236, 72, 153, 0.6)', 'rgba(168, 85, 247, 0.3)']
                    : 'transparent',
                }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ borderRadius: 'inherit' }}
              />
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Composants prédéfinis pour des cas d'usage courants
export const ConfirmModal = ({ 
  message, 
  onConfirm, 
  ...props 
}: Omit<ModalProps, 'children'> & { message: string }) => (
  <Modal 
    variant="warning" 
    confirmVariant="danger"
    icon={<AlertCircle className="h-6 w-6 text-yellow-500" />}
    {...props}
    onConfirm={onConfirm}
  >
    <div className="text-center py-4">
      <p className="text-gray-700 dark:text-gray-300">{message}</p>
    </div>
  </Modal>
);

export const SuccessModal = ({ 
  message, 
  ...props 
}: Omit<ModalProps, 'children'> & { message: string }) => (
  <Modal 
    variant="success" 
    confirmVariant="success"
    icon={<Check className="h-6 w-6 text-green-500" />}
    {...props}
  >
    <div className="text-center py-4">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      <p className="text-gray-700 dark:text-gray-300">{message}</p>
    </div>
  </Modal>
);

export const PremiumModal = ({ 
  message, 
  onConfirm, 
  ...props 
}: Omit<ModalProps, 'children'> & { message: string }) => (
  <Modal 
    variant="premium" 
    confirmVariant="premium"
    icon={<Sparkles className="h-6 w-6 text-purple-500" />}
    {...props}
    onConfirm={onConfirm}
  >
    <div className="text-center py-4">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
        <Star className="h-8 w-8 text-white" />
      </div>
      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        Fonctionnalité Premium
      </h4>
      <p className="text-gray-700 dark:text-gray-300 mb-6">{message}</p>
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          ⚡ Accédez à toutes les fonctionnalités avancées
        </p>
      </div>
    </div>
  </Modal>
);

export const LoadingModal = ({ 
  message = 'Chargement en cours...', 
  ...props 
}: Omit<ModalProps, 'children'>) => (
  <Modal 
    loading={true}
    showCancel={false}
    showFooter={false}
    preventClose={true}
    {...props}
  >
    <div className="text-center py-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="mx-auto mb-4"
      >
        <Loader2 className="h-12 w-12 text-blue-500" />
      </motion.div>
      <p className="text-gray-700 dark:text-gray-300">{message}</p>
    </div>
  </Modal>
);

export const DeleteModal = ({ 
  itemName, 
  onConfirm, 
  ...props 
}: Omit<ModalProps, 'children'> & { itemName: string }) => (
  <Modal 
    variant="danger" 
    confirmVariant="danger"
    confirmLabel="Supprimer définitivement"
    icon={<AlertCircle className="h-6 w-6 text-red-500" />}
    {...props}
    onConfirm={onConfirm}
  >
    <div className="text-center py-4">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
        Confirmer la suppression
      </h4>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Êtes-vous sûr de vouloir supprimer <strong>{itemName}</strong> ?
      </p>
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
        <p className="text-sm text-red-700 dark:text-red-300">
          ⚠️ Cette action est irréversible et ne peut pas être annulée.
        </p>
      </div>
    </div>
  </Modal>
);

export default Modal;