"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";

// UI imports
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import FileUploader from "@/components/FileUploader";

// utils imports
import { navItems } from "@/constants";
import { cn } from "@/lib/utils";

// server actions
import { signOutUser } from "@/lib/actions/user.actions";

// current component ⚛️
const MobileNavigation = ({
  $id: ownerId,
  accountId,
  fullname,
  avatar,
  email,
}: {
  $id: string;
  accountId: string;
  fullname: string;
  avatar: string;
  email: string;
}) => {
  // states
  const [isOpen, setIsOpen] = useState(false);

  // nav
  const pathname = usePathname();

  return (
    <header className="mobile-header">
      <Image
        src="assets/icons/logo-full-brand.svg"
        alt="logo"
        width={120}
        height={52}
        className="h-auto"
      />

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        {/* menu icon */}
        <SheetTrigger>
          <Image
            src="/assets/icons/menu.svg"
            alt="search"
            height={30}
            width={30}
          />
        </SheetTrigger>

        <SheetContent className="shad-sheet h-screen px-3">
          {/* Name and email */}
          <SheetTitle>
            <div className="header-user">
              <Image
                src={avatar}
                alt="avatar"
                width={44}
                height={44}
                className="header-user-avatar"
              />
              <div className="sm:hidden lg:block">
                <p className="subtitle-2 capitalize">{fullname}</p>
                <p className="caption">{email}</p>
              </div>
            </div>
            <Separator className="mb-4 bg-light-200/20" />
          </SheetTitle>

          {/* nav links */}
          <nav className="mobile-nav">
            <ul className="mobile-nav-list">
              {navItems.map(({ url, name, icon }) => (
                <Link href={url} key={name} className="lg:w-full">
                  <li
                    className={cn(
                      "mobile-nav-item",
                      pathname === url && "shad-active",
                    )}
                  >
                    <Image
                      src={icon}
                      alt={name}
                      width={24}
                      height={24}
                      className={cn(
                        "nav-icon",
                        pathname === url && "nav-icon-active",
                      )}
                    />
                    <p>{name}</p>
                  </li>
                </Link>
              ))}
            </ul>
          </nav>

          <Separator className="mb-4 bg-light-200/20" />

          <div className="flex flex-col justify-between gap-5 pb-5">
            {/* file upload */}
            <FileUploader ownerId={ownerId} accountId={accountId} />

            {/* sign out button */}
            <Button
              type="submit"
              className="sign-out-button"
              onClick={async () => {
                await signOutUser();
                redirect("/sign-in");
              }}
            >
              <Image
                src="/assets/icons/logout.svg"
                alt="logout"
                width={24}
                height={24}
              />
              <p>Logout</p>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default MobileNavigation;
