import React from 'react';
import Switch from 'react-switch';

const ToggleStatus = ({ enabled, onChange }) => {
  const handleToggle = () => {
    onChange(!enabled);
  };

  return (
    <Switch
      onChange={handleToggle}
      checked={enabled}
      onColor="#4CAF50"
      offColor="#ccc"
      uncheckedIcon={false}
      checkedIcon={false}
    />
  );
};

export default ToggleStatus;
