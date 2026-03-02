import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Info,
  InstallDesktop,
  Storage,
  WifiOff
} from '@mui/icons-material';

const PWATest = () => {
  const [pwaFeatures, setPwaFeatures] = React.useState({
    serviceWorker: false,
    installable: false,
    offline: false,
    standalone: false,
    notifications: false
  });

  React.useEffect(() => {
    const features = {
      serviceWorker: 'serviceWorker' in navigator,
      installable: window.matchMedia('(display-mode: standalone)').matches || 
                  window.navigator.standalone ||
                  (window.deferredPrompt !== undefined),
      offline: navigator.onLine === false,
      standalone: window.matchMedia('(display-mode: standalone)').matches,
      notifications: 'Notification' in window && Notification.permission === 'granted'
    };
    setPwaFeatures(features);
  }, []);

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        PWA Features Test
      </Typography>
      <List>
        <ListItem>
          <ListItemIcon>
            {pwaFeatures.serviceWorker ? 
              <CheckCircle color="success" /> : 
              <Error color="error" />
            }
          </ListItemIcon>
          <ListItemText 
            primary="Service Worker" 
            secondary={pwaFeatures.serviceWorker ? 'Supported' : 'Not supported'}
          />
        </ListItem>
        
        <ListItem>
          <ListItemIcon>
            {pwaFeatures.installable ? 
              <InstallDesktop color="success" /> : 
              <Error color="error" />
            }
          </ListItemIcon>
          <ListItemText 
            primary="Installable" 
            secondary={pwaFeatures.installable ? 'Can be installed' : 'Cannot be installed'}
          />
        </ListItem>
        
        <ListItem>
          <ListItemIcon>
            {pwaFeatures.offline ? 
              <WifiOff color="warning" /> : 
              <CheckCircle color="success" />
            }
          </ListItemIcon>
          <ListItemText 
            primary="Offline Support" 
            secondary={pwaFeatures.offline ? 'Currently offline' : 'Online'}
          />
        </ListItem>
        
        <ListItem>
          <ListItemIcon>
            {pwaFeatures.standalone ? 
              <CheckCircle color="success" /> : 
              <Info color="info" />
            }
          </ListItemIcon>
          <ListItemText 
            primary="Standalone Mode" 
            secondary={pwaFeatures.standalone ? 'Running as app' : 'Running in browser'}
          />
        </ListItem>
        
        <ListItem>
          <ListItemIcon>
            <Storage color="info" />
          </ListItemIcon>
          <ListItemText 
            primary="Storage" 
            secondary={`${Math.round((JSON.stringify(localStorage).length / 1024) * 100) / 100} KB used`}
          />
        </ListItem>
      </List>
    </Paper>
  );
};

export default PWATest;