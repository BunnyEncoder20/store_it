import React from "react";
import Image from "next/image";

// UI imports
import { Button } from "@/components/ui/button";

// component imports
import Search from "@/components/Search";
import FileUploader from "./FileUploader";

// current component ⚛️
const Header = () => {
  return (
    <header className="header">
      <Search />

      <div className="header-wrapper">
        <FileUploader />
        <form>
          <Button type="submit" className="sign-out-button">
            <Image
              src="/assets/icons/logout.svg"
              alt="logout"
              width={24}
              height={24}
              className="w-6"
            />
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
