const Footer = () => {
  return (
    <footer className="border-t border-border">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h3 className="text-2xl font-bold gradient-text font-heading mb-2">
              XI RPL 2 SMK INFOKOM
            </h3>
            <p className="text-muted-foreground">
              Rekayasa Perangkat Lunak - Membangun Masa Depan Digital
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <p className="text-muted-foreground text-sm mb-2">
              &copy; XI RPL 2 - All rights reserved
            </p>
            <p className="text-muted-foreground/60 text-sm">
              Made by BadutZY & Lovable
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
