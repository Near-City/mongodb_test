import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import LayersIcon from '@mui/icons-material/Layers';

function MapToolbar() {
  return (
    <AppBar position="static" color="default" style={{ marginBottom: '10px' }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="zoom in">
          <ZoomInIcon />
        </IconButton>
        <IconButton edge="start" color="inherit" aria-label="zoom out">
          <ZoomOutIcon />
        </IconButton>
        <IconButton edge="start" color="inherit" aria-label="layers">
          <LayersIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default MapToolbar;
