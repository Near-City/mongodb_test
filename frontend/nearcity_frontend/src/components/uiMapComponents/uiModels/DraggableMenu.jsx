import React, { useState, useRef, useEffect } from 'react';
import { XMarkIcon, MinusIcon } from '@heroicons/react/24/solid';
import { CSSTransition } from 'react-transition-group';

const DraggableMenu = ({ icon, children, initialPosition = { x: 100, y: 100 }, onClose }) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 300, height: 200 });
  const [isResizing, setIsResizing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const menuRef = useRef(null);
  const contentRef = useRef(null);

  const handleMouseDown = (e) => {
    const rect = menuRef.current.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDragging(true);
    e.stopPropagation();
    e.preventDefault();
  };

  const handleMouseUp = (e) => {
    setIsDragging(false);
    setIsResizing(false);
    document.removeEventListener('mousemove', handleMouseMove, true);
    document.removeEventListener('mouseup', handleMouseUp, true);
    e.stopPropagation();
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
      e.stopPropagation();
      e.preventDefault();
    } else if (isResizing) {
      setSize({
        width: Math.max(e.clientX - position.x, 100),
        height: Math.max(e.clientY - position.y, 100),
      });
      e.stopPropagation();
      e.preventDefault();
    }
  };

  const handleMouseDownResize = (e) => {
    setIsResizing(true);
    e.stopPropagation();
    e.preventDefault();
  };

  const handleMinimize = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsMinimized(true);
      setIsTransitioning(false);
    }, 300);
  };

  const handleRestore = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsMinimized(false);
      setIsTransitioning(false);
    }, 300);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove, true);
      document.addEventListener('mouseup', handleMouseUp, true);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove, true);
      document.removeEventListener('mouseup', handleMouseUp, true);
    };
  }, [isDragging, isResizing]);

  useEffect(() => {
    const adjustSizeToContent = () => {
      if (contentRef.current) {
        const contentRect = contentRef.current.getBoundingClientRect();
        setSize({
          width: contentRect.width + 16, // Add padding or borders
          height: contentRect.height + 64, // Include the draggable bar height
        });
      }
    };

    // Wait for the children to render fully
    const timeoutId = setTimeout(adjustSizeToContent, 0);

    return () => clearTimeout(timeoutId);
  }, [children]);

  return (
    <>
      <CSSTransition
        in={!isMinimized && !isTransitioning}
        timeout={300}
        classNames="menu"
        unmountOnExit
      >
        <div
          ref={menuRef}
          className="absolute bg-white shadow-lg rounded-md"
          style={{ left: position.x, top: position.y, width: size.width, height: size.height, zIndex: 9999, pointerEvents: 'auto' }}
        >
          <div
            className="draggable-bar bg-blue-500 text-white flex justify-between items-center p-2 cursor-move"
            onMouseDown={handleMouseDown}
          >
            <span>{icon}</span>
            <div className="flex items-center">
              <button onClick={handleMinimize} className="mr-2">
                <MinusIcon className="h-5 w-5" />
              </button>
              <button onClick={onClose}>
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div
            ref={contentRef}
            className="p-4 overflow-auto"
            style={{ height: `calc(${size.height}px - 64px)` }}
          >
            {children}
          </div>
          <div
            className="absolute bottom-0 right-0 w-4 h-4 bg-gray-500 cursor-se-resize"
            onMouseDown={handleMouseDownResize}
          ></div>
        </div>
      </CSSTransition>

      {isMinimized && (
        <div
          className="absolute bg-blue-500 text-white rounded-full p-2 cursor-pointer"
          style={{ left: position.x, top: position.y, zIndex: 9999 }}
          onClick={handleRestore}
        >
          {icon}
        </div>
      )}
    </>
  );
};

export default DraggableMenu;
