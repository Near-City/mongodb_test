import React from 'react';

const SelectComponent = ({ items, onChange, selectedValue }) => {
  return (
    <div className="relative ">
      <select
        className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
        value={selectedValue}
        onChange={(e) => onChange(e.target.value)}
      >
        {items.map((item, index) => (
          <option key={index} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.516 7.548l4.484 4.484 4.484-4.484-1.06-1.06-3.424 3.424-3.424-3.424z"/></svg>
      </div>
    </div>
  );
};

export default SelectComponent;
