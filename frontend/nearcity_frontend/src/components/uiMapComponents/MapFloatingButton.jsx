const MapFloatingButton = ({ onClick }) => {
  return (
    <button>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-auto p-2 bg-secondary rounded-full shadow-md hover:bg-primary hover:text-white cursor-pointer hover:shadow-lg transition duration-300 ease-in-out"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            onClick={(e) => {e.stopPropagation(); onClick();}}
        >
            <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
        </svg>
    </button>
    );
}

export default MapFloatingButton;