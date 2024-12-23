import React from "react";
import Image from "next/image";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <section className="bg-brand p-10 hidden w-1/2 items-center justify-center lg:flex xl:w-2/5">
        <div className="flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12">
          <Image
            src="/assets/icons/logo-full.svg"
            alt="logo"
            height={82}
            width={224}
            className="h-auto"
          />

          <div className="space-y-5 text-white">
            <h1 className="h1">
              Manage your Files in the best way
            </h1>
            <p className="body-1">
              This is a place where you can store all your files in one place.
            </p>
          </div>
          <Image
            src="/assets/images/files.png"
            alt="illustration"
            height={342}
            width={342}
            className="transition-all hover:rotate-2 hover:scale-105"
          />
        </div>
      </section>
      {children}
    </div>
  );
};

export default layout;
