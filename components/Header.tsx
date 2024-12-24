import React from "react";
import Image from "next/image";

// UI imports
import { Button } from "@/components/ui/button";

// component imports
import Search from "@/components/Search";
import FileUploader from "./FileUploader";

// server actions
import { signOutUser } from "@/lib/actions/user.actions";

// current component ⚛️
const Header = () => {
  return (
    <header className="header">
      <Search />

      <div className="header-wrapper">
        <FileUploader />
        <form
          action={async () => {
            "use server";
            await signOutUser();
          }}
        >
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
