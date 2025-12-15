import { ButtonHTMLAttributes, ReactNode, useState } from 'react';
import { 
  Loader2, Sparkles, Zap, ChevronRight, Check, 
  ArrowRight, Plus, X, AlertCircle, Star, Target,
  Download, Upload, RefreshCw, Eye, Trash2, Edit
} from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost' | 'gradient' | 'premium';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children: ReactNode;
  loading?: boolean;
  success?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  animated?: boolean;
  pulse?: boolean;
  glow?: boolean;
  shadow?: boolean;
  gradientDirection?: 'left-right' | 'top-bottom' | 'diagonal';
  onHover?: () => void;
  onClickAnimation?: 'bounce' | 'ripple' | 'scale' | 'rotate';
}

const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  loading = false,
  success = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  rounded = 'md',
  animated = true,
  pulse = false,
  glow = false,
  shadow = true,
  gradientDirection = 'left-right',
  onHover,
  onClickAnimation = 'scale',
  disabled,
  ...props 
}: ButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const controls = useAnimation();
  const iconControls = useAnimation();

  const sizeClasses = {
    xs: 'text-xs px-3 py-1.5',
    sm: 'text-sm px-4 py-2',
    md: 'text-base px-6 py-3',
    lg: 'text-lg px-8 py-4',
    xl: 'text-xl px-10 py-5',
  };

  const roundedClasses = {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    full: 'rounded-full',
  };

  const gradientDirections = {
    'left-right': 'bg-gradient-to-r',
    'top-bottom': 'bg-gradient-to-b',
    'diagonal': 'bg-gradient-to-br',
  };

  const variantClasses = {
    primary: `${gradientDirections[gradientDirection]} from-blue-500 to-cyan-600 text-white hover:from-blue-600 hover:to-cyan-700 border border-blue-500/30`,
    secondary: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300 border border-gray-300/50 hover:border-gray-400/50',
    danger: `${gradientDirections[gradientDirection]} from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 border border-red-500/30`,
    success: `${gradientDirections[gradientDirection]} from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 border border-green-500/30`,
    warning: `${gradientDirections[gradientDirection]} from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 border border-amber-500/30`,
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 border border-gray-300/30',
    gradient: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 border border-purple-500/30',
    premium: 'bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-gray-900 hover:from-yellow-500 hover:via-amber-600 hover:to-orange-600 border border-amber-400/30',
  };

  const iconSizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-7 w-7',
  };

  const handleMouseEnter = async () => {
    setIsHovered(true);
    if (animated) {
      await controls.start({
        y: -2,
        transition: { duration: 0.2 }
      });
    }
    if (onHover) onHover();
  };

  const handleMouseLeave = async () => {
    setIsHovered(false);
    if (animated) {
      await controls.start({
        y: 0,
        transition: { duration: 0.2 }
      });
    }
  };

  const handleMouseDown = async () => {
    setIsPressed(true);
    if (animated) {
      await controls.start({
        scale: 0.95,
        transition: { duration: 0.1 }
      });
    }
  };

  const handleMouseUp = async () => {
    setIsPressed(false);
    if (animated) {
      await controls.start({
        scale: 1,
        transition: { duration: 0.1 }
      });
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClickAnimation === 'ripple' && !disabled) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newRipple = { x, y, id: Date.now() };
      setRipples(prev => [...prev, newRipple]);
      
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 600);
    }

    if (props.onClick) {
      props.onClick(e);
    }
  };

  const renderIcon = () => {
    if (loading) {
      return (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={iconSizes[size]}
        >
          <Loader2 className={iconSizes[size]} />
        </motion.div>
      );
    }
    
    if (success) {
      return (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className={iconSizes[size]}
        >
          <Check className={iconSizes[size]} />
        </motion.div>
      );
    }
    
    if (icon) {
      return (
        <motion.div
          animate={iconControls}
          onHoverStart={() => {
            if (animated) {
              iconControls.start({
                scale: 1.2,
                transition: { duration: 0.2 }
              });
            }
          }}
          onHoverEnd={() => {
            if (animated) {
              iconControls.start({
                scale: 1,
                transition: { duration: 0.2 }
              });
            }
          }}
          className={iconSizes[size]}
        >
          {icon}
        </motion.div>
      );
    }
    
    return null;
  };

  return (
    <motion.button
      initial={animated ? { opacity: 0, scale: 0.9 } : false}
      animate={controls}
      whileHover={animated && !disabled ? { 
        scale: 1.05,
        transition: { duration: 0.2 }
      } : undefined}
      whileTap={animated && !disabled ? { 
        scale: 0.95,
        transition: { duration: 0.1 }
      } : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        relative overflow-hidden
        ${sizeClasses[size]}
        ${roundedClasses[rounded]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${shadow ? 'shadow-lg hover:shadow-xl' : ''}
        ${glow ? 'shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50' : ''}
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        disabled:transform-none disabled:shadow-none
        font-medium tracking-wide
        group
        ${className}
      `}
      {...props}
    >
      {/* Effet de brillance au survol */}
      {animated && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%]"
          animate={{
            translateX: ["-200%", "200%"]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 3
          }}
        />
      )}

      {/* Ripple effect */}
      {onClickAnimation === 'ripple' && (
        <div className="absolute inset-0 overflow-hidden">
          {ripples.map(ripple => (
            <motion.span
              key={ripple.id}
              className="absolute bg-white/30 rounded-full"
              initial={{ 
                width: 0, 
                height: 0,
                opacity: 1,
                x: ripple.x,
                y: ripple.y,
              }}
              animate={{ 
                width: 200, 
                height: 200,
                opacity: 0,
                x: ripple.x - 100,
                y: ripple.y - 100,
              }}
              transition={{ duration: 0.6 }}
            />
          ))}
        </div>
      )}

      {/* Effet de particules pour premium */}
      {variant === 'premium' && isHovered && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              initial={{ 
                opacity: 0,
                scale: 0,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                y: [-10, -50],
                x: [(Math.random() - 0.5) * 20],
              }}
              transition={{
                duration: 1,
                delay: i * 0.1,
              }}
            />
          ))}
        </>
      )}

      {/* Animation de pulse */}
      {pulse && !disabled && (
        <motion.div
          className="absolute inset-0 border-2 border-white/30 rounded-xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      )}

      {/* Contenu du bouton */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {iconPosition === 'left' && renderIcon()}
        <motion.span
          animate={loading || success ? { opacity: 0.7 } : { opacity: 1 }}
          className="flex items-center gap-2"
        >
          {children}
        </motion.span>
        {iconPosition === 'right' && renderIcon()}
      </span>

      {/* Effet de bordure animée */}
      <motion.div
        className="absolute inset-0 border-2 border-transparent rounded-xl pointer-events-none"
        animate={{
          borderColor: isHovered && !disabled ? ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,0.3)'] : 'transparent',
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Effet de dégradé animé pour la variante gradient */}
      {variant === 'gradient' && animated && (
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        />
      )}
    </motion.button>
  );
};

// Composants prédéfinis pour des cas d'usage courants
export const IconButton = ({ icon, ...props }: Omit<ButtonProps, 'children'> & { icon: ReactNode }) => (
  <Button icon={icon} {...props} />
);

export const LoadingButton = ({ loadingText = 'Chargement...', ...props }: ButtonProps & { loadingText?: string }) => (
  <Button loading {...props}>
    {loadingText}
  </Button>
);

export const SuccessButton = ({ successText = 'Succès !', ...props }: ButtonProps & { successText?: string }) => (
  <Button success {...props}>
    {successText}
  </Button>
);

export const DeleteButton = (props: ButtonProps) => (
  <Button
    variant="danger"
    icon={<Trash2 />}
    iconPosition="left"
    {...props}
  />
);

export const EditButton = (props: ButtonProps) => (
  <Button
    variant="secondary"
    icon={<Edit />}
    iconPosition="left"
    {...props}
  />
);

export const AddButton = (props: ButtonProps) => (
  <Button
    variant="success"
    icon={<Plus />}
    iconPosition="left"
    pulse={true}
    {...props}
  />
);

export const ViewButton = (props: ButtonProps) => (
  <Button
    variant="ghost"
    icon={<Eye />}
    iconPosition="left"
    {...props}
  />
);

export const PremiumButton = (props: ButtonProps) => (
  <Button
    variant="premium"
    icon={<Sparkles />}
    iconPosition="left"
    glow={true}
    shadow={true}
    {...props}
  />
);

export default Button;