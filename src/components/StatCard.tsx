import { ReactNode, useEffect, useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: 'primary' | 'green' | 'blue' | 'purple' | 'orange' | 'pink';
  trend?: 'up' | 'down' | 'neutral';
  changePercentage?: number;
  loading?: boolean;
  delay?: number;
  description?: string;
  onHover?: () => void;
  animated?: boolean;
  sparkle?: boolean;
}

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'primary',
  trend,
  changePercentage,
  loading = false,
  delay = 0,
  description,
  onHover,
  animated = true,
  sparkle = false
}: StatCardProps) => {
  const [displayValue, setDisplayValue] = useState<number | string>(value);
  const controls = useAnimation();
  const iconControls = useAnimation();
  
  const colorClasses = {
    primary: {
      bg: 'bg-gradient-to-br from-primary-50 via-primary-50/80 to-white',
      icon: 'from-primary-500 to-primary-700',
      text: 'text-primary-700',
      border: 'border-primary-200',
      shadow: 'shadow-primary-200/30',
      gradient: 'from-primary-400 to-primary-600',
      light: 'bg-primary-100'
    },
    green: {
      bg: 'bg-gradient-to-br from-emerald-50 via-emerald-50/80 to-white',
      icon: 'from-emerald-500 to-emerald-700',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      shadow: 'shadow-emerald-200/30',
      gradient: 'from-emerald-400 to-emerald-600',
      light: 'bg-emerald-100'
    },
    blue: {
      bg: 'bg-gradient-to-br from-blue-50 via-blue-50/80 to-white',
      icon: 'from-blue-500 to-blue-700',
      text: 'text-blue-700',
      border: 'border-blue-200',
      shadow: 'shadow-blue-200/30',
      gradient: 'from-blue-400 to-blue-600',
      light: 'bg-blue-100'
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-50 via-purple-50/80 to-white',
      icon: 'from-purple-500 to-purple-700',
      text: 'text-purple-700',
      border: 'border-purple-200',
      shadow: 'shadow-purple-200/30',
      gradient: 'from-purple-400 to-purple-600',
      light: 'bg-purple-100'
    },
    orange: {
      bg: 'bg-gradient-to-br from-orange-50 via-orange-50/80 to-white',
      icon: 'from-orange-500 to-orange-700',
      text: 'text-orange-700',
      border: 'border-orange-200',
      shadow: 'shadow-orange-200/30',
      gradient: 'from-orange-400 to-orange-600',
      light: 'bg-orange-100'
    },
    pink: {
      bg: 'bg-gradient-to-br from-pink-50 via-pink-50/80 to-white',
      icon: 'from-pink-500 to-pink-700',
      text: 'text-pink-700',
      border: 'border-pink-200',
      shadow: 'shadow-pink-200/30',
      gradient: 'from-pink-400 to-pink-600',
      light: 'bg-pink-100'
    }
  };

  useEffect(() => {
    if (typeof value === 'number' && animated) {
      const duration = 1500;
      const startValue = 0;
      const endValue = value;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.round(startValue + (endValue - startValue) * easeOutQuart);
        
        setDisplayValue(currentValue.toLocaleString());
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayValue(endValue.toLocaleString());
        }
      };
      
      animate();
    } else {
      setDisplayValue(value);
    }
  }, [value, animated]);

  useEffect(() => {
    if (animated) {
      controls.start({
        y: 0,
        opacity: 1,
        transition: {
          delay: delay * 0.1,
          duration: 0.5,
          type: "spring",
          stiffness: 100
        }
      });

      iconControls.start({
        scale: [1, 1.2, 1],
        rotate: [0, 10, -10, 0],
        transition: {
          delay: delay * 0.1 + 0.3,
          duration: 0.6
        }
      });
    }
  }, [animated, controls, delay, iconControls]);

  const handleHoverStart = async () => {
    if (animated) {
      await controls.start({
        y: -5,
        transition: { duration: 0.2 }
      });
    }
    if (onHover) onHover();
  };

  const handleHoverEnd = () => {
    if (animated) {
      controls.start({
        y: 0,
        transition: { duration: 0.2 }
      });
    }
  };

  return (
    <motion.div
      initial={animated ? { y: 20, opacity: 0 } : false}
      animate={controls}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      className={`relative group overflow-hidden rounded-2xl border ${colorClasses[color].border} ${colorClasses[color].bg} shadow-lg hover:shadow-xl transition-all duration-300 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]`}
    >
      {/* Effet de brillance au survol */}
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
      
      {/* Effet de particules scintillantes */}
      {sparkle && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                top: `${20 + i * 20}%`,
                left: `${10 + i * 25}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </>
      )}

      <div className="relative z-10 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
              {title}
              {trend && changePercentage && (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {trend === 'up' ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {changePercentage}%
                </span>
              )}
            </p>
            
            {loading ? (
              <div className="space-y-2 mt-2">
                <div className="h-8 w-24 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
            ) : (
              <>
                <motion.p 
                  key={value}
                  initial={animated ? { scale: 0.9, opacity: 0 } : false}
                  animate={animated ? { scale: 1, opacity: 1 } : false}
                  transition={{ duration: 0.3 }}
                  className="text-3xl font-bold text-gray-900 mt-2"
                >
                  {displayValue}
                </motion.p>
                
                {description && (
                  <p className="text-sm text-gray-500 mt-2 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-gray-300 mr-2" />
                    {description}
                  </p>
                )}
              </>
            )}
          </div>
          
          <motion.div
            animate={iconControls}
            className={`relative p-3 rounded-xl bg-gradient-to-br ${colorClasses[color].icon} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
          >
            {/* Anneau externe animé */}
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-white/30"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            />
            
            {/* Point lumineux */}
            <motion.div
              className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white"
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity
              }}
            />
            
            <Icon className="h-6 w-6 text-white relative z-10" />
          </motion.div>
        </div>
        
        {/* Barre de progression décorative */}
        <div className="mt-6 pt-4 border-t border-gray-200/50">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Performance</span>
            <span className={`font-medium ${colorClasses[color].text}`}>Excellent</span>
          </div>
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${colorClasses[color].gradient} rounded-full`}
              initial={animated ? { width: 0 } : false}
              animate={animated ? { width: "85%" } : false}
              transition={{
                delay: delay * 0.1 + 0.5,
                duration: 1,
                type: "spring",
                stiffness: 50
              }}
            />
          </div>
        </div>
      </div>

      {/* Effet de rebond au survol */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        animate={{
          scaleX: [0, 1, 0],
        }}
        transition={{
          duration: 0.8,
          times: [0, 0.5, 1],
        }}
      />
    </motion.div>
  );
};

export default StatCard;