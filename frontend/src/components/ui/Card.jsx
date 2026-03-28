import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className, 
  noPadding = false, 
  title, 
  subtitle, 
  action,
  onClick
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={clsx(
        "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden",
        onClick && "cursor-pointer hover:shadow-md transition-shadow duration-200",
        className
      )}
    >
      {(title || action) && (
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={clsx(!noPadding && "p-6")}>
        {children}
      </div>
    </motion.div>
  );
};

export default Card;
