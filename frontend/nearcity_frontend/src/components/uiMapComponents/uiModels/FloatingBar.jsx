const FloatingBar = ({ width="20%", top="16px", left="48px", children }) => {
  return (
    <div className="relative  z-[999] bg-secondary rounded-full shadow-md p-4 transition duration-300 ease-in-out hover:shadow-lg"
    style={{ width: width, top: top, left: left}}
    >
      {children}
    </div>
  );
};

export default FloatingBar;