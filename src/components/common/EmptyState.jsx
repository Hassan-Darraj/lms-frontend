import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import './EmptyState.css';

const EmptyState = ({ 
  title, 
  message, 
  action,
  icon = '📋',
  className = ''
}) => {
  return (
    <div className={`empty-state ${className}`}>
      <div className="empty-state-content">
        <div className="empty-state-icon">{icon}</div>
        <h3 className="empty-state-title">{title}</h3>
        <p className="empty-state-message">{message}</p>
        
        {action && (
          <div className="empty-state-actions">
            <Button
              variant={action.variant || 'primary'}
              onClick={action.onClick}
              icon={action.icon}
              size={action.size || 'medium'}
              className={action.className}
              disabled={action.disabled}
            >
              {action.label}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  action: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    variant: PropTypes.string,
    icon: PropTypes.node,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    className: PropTypes.string,
    disabled: PropTypes.bool
  }),
  icon: PropTypes.node,
  className: PropTypes.string
};

export default EmptyState;
