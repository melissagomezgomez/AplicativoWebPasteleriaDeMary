import React from "react";
import Link from "next/link";

export const Header: React.FC = () => {
  return (
    <header className="bg-primary sticky top-0 z-50 shadow-md">
      <div className="container flex h-full items-center justify-between px-2 md:px-0">
        <Link href="/" className="flex gap-4">
          <img src="/logo.png" width="5%" />
          <img src="/letras.png" width="22%" className="mt-3" />
        </Link>
      </div>
    </header>
  );
};
