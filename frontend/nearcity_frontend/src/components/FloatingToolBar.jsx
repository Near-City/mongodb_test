import React from 'react';
import { Fab, Zoom, Tooltip, Stack } from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import BusinessIcon from '@mui/icons-material/Business'; // Representa distritos
import LocationCityIcon from '@mui/icons-material/LocationCity'; // Representa barrios
import MapIcon from '@mui/icons-material/Map'; // Representa secciones

function FloatingToolbar({ onCenter, onDistricts, onNeighborhoods, onSections }) {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 1000
      }}
    >
      <Tooltip title="Centrar Mapa" placement="left">
        <Fab color="primary" size="small" onClick={onCenter}>
          <MyLocationIcon />
        </Fab>
      </Tooltip>
      <Tooltip title="Distritos" placement="left">
        <Fab color="secondary" size="small" onClick={onDistricts}>
          <BusinessIcon />
        </Fab>
      </Tooltip>
      <Tooltip title="Barrios" placement="left">
        <Fab color="secondary" size="small" onClick={onNeighborhoods}>
          <LocationCityIcon />
        </Fab>
      </Tooltip>
      <Tooltip title="Secciones" placement="left">
        <Fab color="secondary" size="small" onClick={onSections}>
          <MapIcon />
        </Fab>
      </Tooltip>
    </Stack>
  );
}

export default FloatingToolbar;
