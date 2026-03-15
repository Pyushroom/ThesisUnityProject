import React, { useState } from 'react';
import { Button, Paper, Typography } from '@mui/material';

const styles = {
  banner: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f7f7f7',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1300, // Equivalent to the default modal zIndex in the theme
  },
  acceptButton: {
    marginLeft: '16px',
  },
};

const CookieConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(true);

  const handleAccept = () => {
    document.cookie = 'cookieConsent=true; max-age=2592000';
    setShowBanner(false);
  };

  const handleDecline = () => {
    setShowBanner(false);
  };

  const renderBanner = () => {
    return (
      <Paper style={styles.banner}>
        <Typography>
          This website uses cookies to improve your experience. Do you accept?
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAccept} style={styles.acceptButton}>
          Accept
        </Button>
        <Button variant="contained" onClick={handleDecline}>
          Decline
        </Button>
      </Paper>
    );
  };

  const cookieConsent = document.cookie.split(';').some((cookie) => cookie.trim().startsWith('cookieConsent='));
  if (cookieConsent) {
    return null;
  }

  return showBanner ? renderBanner() : null;
};

export default CookieConsentBanner;
