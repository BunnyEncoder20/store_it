import React from "react";
import Image from "next/image";
import { redirect } from "next/navigation";

// UI imports
import { Button } from "@/components/ui/button";

// component imports
import Search from "@/components/Search";
import FileUploader from "./FileUploader";

// server actions
import { signOutUser } from "@/lib/actions/user.actions";

// current component ⚛️
const Header = ({
  userId,
  accountId,
}: {
  userId: string;
  accountId: string;
}) => {
  return (
    <header className="header">
      <Search />

      <div className="header-wrapper">
        <FileUploader ownerId={userId} accountId={accountId} />
        <form
          action={async () => {
            "use server";
            await signOutUser();
            redirect("/sign-in");
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
