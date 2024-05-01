import React, { useState } from 'react';
import { IconButton, List, ListItem, ListItemIcon, ListItemText, Divider, Drawer } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SchoolIcon from '@mui/icons-material/School';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';

import SearchBar from './SearchBar';

function SidePanel({open, onFilterByName}) {
  const [isOpen, setIsOpen] = useState(true); // Default open

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const drawerStyle = {
    width: isOpen && open ? 450 : 0,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: isOpen && open ? 450 : 0,
      boxSizing: 'border-box',
      top: 64 // Ajusta esto según la altura de tu barra superior
    }
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={isOpen}
      sx={drawerStyle}
    >
      <div>
        <IconButton onClick={handleToggle}>
          {isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </div>
      <Divider />
      <SearchBar onSearch={(search) => onFilterByName(search)}/>
      <List>
        {['Hospitales', 'Escuelas', 'Parques'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index === 0 ? <LocalHospitalIcon /> : index === 1 ? <SchoolIcon /> : <DirectionsWalkIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default SidePanel;
