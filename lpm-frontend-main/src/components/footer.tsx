import React from "react";

import { PhoneIcon } from "@components";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary">
      <div className="container mx-auto my-4 flex flex-wrap items-center justify-between px-2 md:px-0">
        <div className="hidden gap-4 md:flex text-lg font-semibold text-white">
          Calle 66 # 50 C - 42. Prado Centro, a media cuadra de la estación
          Hospital
        </div>
        <div className="flex flex-col gap-4 text-lg font-semibold text-white md:flex-row">
          <PhoneIcon />
          304-618-50-24
        </div>
      </div>
    </footer>
  );
};
