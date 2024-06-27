const ExecuteBtn = ({onClick}) => {
    return (
        <button className="bg-blue-600 text-white rounded-xl h-12 px-6 py-2 shadow-lg hover:bg-blue-700 transition-colors duration-150 ease-in-out" onClick={onClick}>
  Aplicar
</button>
    )
}

export default ExecuteBtn;