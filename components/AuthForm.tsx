"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";

// custom types
type FormType = "sign-in" | "sign-up";

// zod import
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// UI imports
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// server actions
import { createAccount } from "@/lib/actions/user.actions";
import OTPModal from "./OTPModal";

// form schema
const authFormSchema = (formType: FormType) => {
  return z.object({
    email: z.string().email(),
    fullname: formType === "sign-up"
      ? z.string().min(2).max(50)
      : z.string().optional(),
  });
};

// current component⚛️
const AuthForm = ({ type }: { type: FormType }) => {
  // states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [accountId, setAccountId] = useState("");

  // 1. Define your form.
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      email: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const user = await createAccount({
        fullname: values.fullname || "",
        email: values.email,
      });
      setAccountId(user.accountId);
    } catch (error) {
      console.error("Failed to create an account", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          {/* sigup or signin */}
          <h1 className="form-title">
            {type === "sign-in" ? "Sign In" : "Sign Up"}
          </h1>
          {/* fullname */}
          {type === "sign-up" && (
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <div className="shad-form-item">
                    <FormLabel className="shad-form-label">Full Name</FormLabel>

                    <FormControl>
                      <Input
                        placeholder="enter your full name here"
                        {...field}
                        className="shad-input"
                      />
                    </FormControl>
                  </div>

                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
          )}

          {/* email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Email</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="enter your email here"
                      {...field}
                      className="shad-input"
                    />
                  </FormControl>
                </div>

                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />

          {/* submit button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="form-submit-button"
          >
            {type === "sign-in" ? "Sign In" : "Sign Up"}

            {isLoading && (
              <Image
                src="/assets/icons/loader.svg"
                alt="loader"
                height={24}
                width={24}
                className="animate-spin ml-2"
              />
            )}
          </Button>

          {/* error messages */}
          {errorMessage && <p className="error-message">*{errorMessage}</p>}

          {/* don't/already have account ? */}
          <div className="body-2 flex jsutify-center">
            <p className="text-light-100">
              {type === "sign-in"
                ? "Don't have an account ?"
                : "Already have an account ?"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="ml-1 font-medium text-brand"
            >
              {type === "sign-in" ? "Sign Up" : "Sign In"}
            </Link>
          </div>
        </form>
      </Form>

      {/* Todo: OTP verification */}
      {/*accountId*/ true && (
        <OTPModal email={form.getValues("email")} accountId={accountId} />
      )}
    </>
  );
};

export default AuthForm;
