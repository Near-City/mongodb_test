import {useState} from 'react';
import DraggableMenu from "../uiModels/DraggableMenu";
import { Bars2Icon } from '@heroicons/react/24/solid';
import SelectComponent from '../Selects/SelectComponente';

const SwipeMenu = ({ isMenuOpen, onMenuToggle }) => {
    const minutes = [
        { value: 'option1', label: '5 Minutos' },
        { value: 'option2', label: '10 Minutos' },
        { value: 'option3', label: '15 Minutos' },
        { value: 'option4', label: '20 Minutos' },
        { value: 'option5', label: '25 Minutos' },
        { value: 'option6', label: '30 Minutos' },
      ];

    const tipoIndicador = [
        { value: 'option1', label: 'Colegios' },
        { value: 'option2', label: 'Parques' },
      ];

    const [selectedMinute, setSelectedMinute] = useState('option1');
    const [selectedTipoIndicador, setSelectedTipoIndicador] = useState('option1');

    
    return (
        <>
            {isMenuOpen && (
                <DraggableMenu
                    icon={<Bars2Icon className="h-5 w-5" />}
                    initialPosition={{ x: 200, y: 200 }}
                    onClose={onMenuToggle}
                >
                    <div className="flex flex-col items-center justify-center w-full h-full">
                        <h1 className="text-2xl font-bold mb-4">Swipe</h1>
                        <div className=' gap-5'>
                            <SelectComponent items={minutes} onChange={(value) => setSelectedMinute(value)} selectedValue={selectedMinute} />
                            <SelectComponent items={tipoIndicador} onChange={(value) => setSelectedTipoIndicador(value)} selectedValue={selectedTipoIndicador} />
                        </div>
                    </div>
                </DraggableMenu>
            )}
        </>
    );
};

export default SwipeMenu;
