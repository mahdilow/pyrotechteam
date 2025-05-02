import { Popover } from "@headlessui/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Button from "../Button";
// Local Data
import data from "../../data/portfolio.json";

const Header = ({ handleWorkScroll, handleAboutScroll, isBlog }) => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { name, showBlog, showResume } = data;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <Popover className="block tablet:hidden mt-5">
        {({ open }) => (
          <>
            <div
              className="flex items-center justify-between p-2 laptop:p-0"
              style={{ direction: "rtl" }}
            >
              <div
                onClick={() => router.push("/")}
                className="font-medium p-2 laptop:p-0 link flex items-center cursor-pointer"
              >
                <img
                  src={`/images/logo-${
                    theme === "dark" ? "dark" : "light"
                  }.svg`}
                  alt="Logo"
                  className="h-14 ml-2"
                />
                <h1>{name}</h1>
              </div>

              <div className="flex items-center" style={{ direction: "rtl" }}>
                {data.darkMode && (
                  <Button
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                  >
                    <img
                      className="h-6"
                      src={`/images/${
                        theme === "dark" ? "moon.svg" : "sun.svg"
                      }`}
                    ></img>
                  </Button>
                )}

                <Popover.Button>
                  <img
                    className="h-5"
                    src={`/images/${
                      !open
                        ? theme === "dark"
                          ? "menu-white.svg"
                          : "menu.svg"
                        : theme === "light"
                        ? "cancel.svg"
                        : "cancel-white.svg"
                    }`}
                  ></img>
                </Popover.Button>
              </div>
            </div>
            <Popover.Panel
              className={`absolute left-0 z-10 w-11/12 p-4 ${
                theme === "dark" ? "bg-slate-800" : "bg-white"
              } shadow-md rounded-md`}
            >
              {!isBlog ? (
                <div className="grid grid-cols-1">
                  <Button onClick={handleWorkScroll}>کارها</Button>
                  <Button onClick={handleAboutScroll}>درباره ما</Button>
                  {showBlog && (
                    <Button onClick={() => router.push("/blog")}>بلاگ</Button>
                  )}
                  {showResume && (
                    <Button
                      onClick={() =>
                        window.open("mailto:pyrotech.dev@proton.me")
                      }
                    >
                      رزومه
                    </Button>
                  )}

                  <Button
                    onClick={() => window.open("mailto:pyrotech.dev@proton.me")}
                  >
                    تماس
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1">
                  <Button onClick={() => router.push("/")} classes="first:ml-1">
                    خانه
                  </Button>
                  {showBlog && (
                    <Button onClick={() => router.push("/blog")}>بلاگ</Button>
                  )}
                  {showResume && (
                    <Button
                      onClick={() => router.push("/resume")}
                      classes="first:ml-1"
                    >
                      رزومه
                    </Button>
                  )}

                  <Button
                    onClick={() => window.open("mailto:pyrotech.dev@proton.me")}
                  >
                    Contact
                  </Button>
                </div>
              )}
            </Popover.Panel>
          </>
        )}
      </Popover>
      <div
        className={`mt-10 hidden flex-row-reverse items-center justify-between sticky ${
          theme === "light" && "bg-white"
        } dark:text-white top-0 z-10 tablet:flex`}
        style={{ direction: "rtl" }}
      >
        <div
          onClick={() => router.push("/")}
          className="font-medium cursor-pointer mob:p-2 laptop:p-0 flex items-center"
        >
          <img
            src={`/images/logo-${theme === "dark" ? "dark" : "light"}.svg`}
            alt="Logo"
            className="h-24  ml-2"
          />
          <h1>{name}</h1>
        </div>
        {!isBlog ? (
          <div className="flex" style={{ direction: "rtl" }}>
            <Button onClick={handleWorkScroll}>کارها</Button>
            <Button onClick={handleAboutScroll}>درباره ما</Button>
            {showBlog && (
              <Button onClick={() => router.push("/blog")}>بلاگ</Button>
            )}
            {showResume && (
              <Button
                onClick={() => router.push("/resume")}
                classes="first:ml-1"
              >
                رزومه
              </Button>
            )}

            <Button onClick={() => window.open("tel:+989100711835")}>
              تماس
            </Button>
            {mounted && theme && data.darkMode && (
              <Button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <img
                  className="h-6"
                  src={`/images/${theme === "dark" ? "moon.svg" : "sun.svg"}`}
                ></img>
              </Button>
            )}
          </div>
        ) : (
          <div className="flex" style={{ direction: "rtl" }}>
            <Button onClick={() => router.push("/")}>خانه</Button>
            {showBlog && (
              <Button onClick={() => router.push("/blog")}>بلاگ</Button>
            )}
            {showResume && (
              <Button
                onClick={() => router.push("/resume")}
                classes="first:ml-1"
              >
                رزومه
              </Button>
            )}

            <Button
              onClick={() => window.open("mailto:pyrotech.dev@proton.me")}
            >
              تماس
            </Button>

            {mounted && theme && data.darkMode && (
              <Button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <img
                  className="h-6"
                  src={`/images/${theme === "dark" ? "moon.svg" : "sun.svg"}`}
                ></img>
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
