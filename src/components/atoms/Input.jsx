import React from 'react';

const Input = ({ type = "text", placeholder, value, onChange, className = "" }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full bg-white border border-transparent focus:border-simig-light rounded px-4 py-3 text-sm placeholder-gray-400 outline-none shadow-sm transition ${className}`}
    />
  );
};

export default Input;