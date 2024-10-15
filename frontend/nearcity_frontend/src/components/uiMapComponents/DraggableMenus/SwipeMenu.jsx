import {useState} from 'react';
import DraggableMenu from "../uiModels/DraggableMenu";
import { Bars2Icon } from '@heroicons/react/24/solid';
import SelectComponent from '../Selects/SelectComponente';
import ResourceSelector from '@components/SideBarPages/ResourceSelector';

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
                >  <div>
                        <h1 className='bold'>Swipe</h1>
                    <ResourceSelector />
                </div>
                </DraggableMenu>
            )}
        </>
    );
};

export default SwipeMenu;
