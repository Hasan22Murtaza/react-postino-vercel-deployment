import React, { useState, useEffect } from 'react';

const Footer = () => {
  const [fullYear, setFullYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setFullYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="footer d-flex flex-column flex-md-row align-items-center justify-content-between">
      <p className="text-muted text-center text-md-left">
        Copyright © {fullYear} <a href="javascript:void(0);">Postino</a>. All rights reserved
      </p>
    </footer>
  );
};

export default Footer;
