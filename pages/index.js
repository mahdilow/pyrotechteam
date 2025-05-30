import { useRef, useState, useEffect } from "react";
import Header from "../components/Header";
import ServiceCard from "../components/ServiceCard";
import WorkCard from "../components/WorkCard";
import { useIsomorphicLayoutEffect } from "../utils";
import { stagger } from "../animations";
import Footer from "../components/Footer";
import Head from "next/head";
import Button from "../components/Button";
import Link from "next/link";
import Cursor from "../components/Cursor";
import { useTheme } from "next-themes";

// Local Data
import data from "../data/portfolio.json";

export default function Home() {
  // Ref
  const workRef = useRef();
  const aboutRef = useRef();
  const textOne = useRef();
  const textTwo = useRef();
  const textThree = useRef();
  const textFour = useRef();
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  // When mounted on client, now we can show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handling Scroll
  const handleWorkScroll = () => {
    window.scrollTo({
      top: workRef.current.offsetTop,
      left: 0,
      behavior: "smooth",
    });
  };

  const handleAboutScroll = () => {
    window.scrollTo({
      top: aboutRef.current.offsetTop,
      left: 0,
      behavior: "smooth",
    });
  };

  useIsomorphicLayoutEffect(() => {
    // Only run animation when mounted and all refs are available
    if (
      mounted &&
      textOne.current &&
      textTwo.current &&
      textThree.current &&
      textFour.current
    ) {
      stagger(
        [textOne.current, textTwo.current, textThree.current, textFour.current],
        { y: 40, x: -10, transform: "scale(0.95) skew(10deg)" },
        { y: 0, x: 0, transform: "scale(1)" }
      );
    }
  }, [mounted]);

  // Prevent theme flash on load
  if (!mounted) return null;

  // Check if user is authenticated
  const isAuthenticated =
    typeof window !== "undefined"
      ? sessionStorage.getItem("isAuthenticated")
      : false;

  return (
    <div
      className={`relative ${data.showCursor && "cursor-none"}`}
      style={{ direction: "rtl" }}
    >
      {data.showCursor && <Cursor />}
      <Head>
        <title>{data.name}</title>
      </Head>

      <div className="gradient-circle"></div>
      <div className="gradient-circle-bottom"></div>

      <div className="container mx-auto mb-10">
        <Header
          handleWorkScroll={handleWorkScroll}
          handleAboutScroll={handleAboutScroll}
        />
        <div className="laptop:mt-20 mt-10">
          <div className="mt-5">
            <h1
              ref={textOne}
              className={`text-3xl tablet:text-6xl laptop:text-6xl laptopl:text-8xl p-1 tablet:p-2 text-bold w-4/5 mob:w-full laptop:w-4/5 text-right ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
              style={{ textAlign: "right" }}
            >
              {data.headerTaglineOne}
            </h1>
            <h1
              ref={textTwo}
              className={`text-3xl tablet:text-6xl laptop:text-6xl laptopl:text-8xl p-1 tablet:p-2 text-bold w-full laptop:w-4/5 text-right ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
              style={{ textAlign: "right" }}
            >
              {data.headerTaglineTwo}
            </h1>
            <h1
              ref={textThree}
              className={`text-3xl tablet:text-6xl laptop:text-6xl laptopl:text-8xl p-1 tablet:p-2 text-bold w-full laptop:w-4/5 text-right ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
              style={{ textAlign: "right" }}
            >
              {data.headerTaglineThree}
            </h1>
            <h1
              ref={textFour}
              className={`text-3xl tablet:text-6xl laptop:text-6xl laptopl:text-8xl p-1 tablet:p-2 text-bold w-full laptop:w-4/5 text-right ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
              style={{ textAlign: "right" }}
            >
              {data.headerTaglineFour}
            </h1>
          </div>

          {/* Social links are now only in the footer */}
        </div>
        <div className="mt-10 laptop:mt-30 p-2 laptop:p-0" ref={workRef}>
          <h1
            className={`text-2xl text-bold text-right ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            نمونه کارها
          </h1>

          <div className="mt-5 laptop:mt-10 grid grid-cols-1 tablet:grid-cols-2 gap-4">
            {data.projects.map((project) => (
              <WorkCard
                key={project.id}
                img={project.imageSrc}
                name={project.title}
                description={project.description}
                onClick={() => window.open(project.url)}
              />
            ))}
          </div>
        </div>

        <div className="mt-10 laptop:mt-30 p-2 laptop:p-0">
          <h1
            className={`tablet:m-10 text-2xl text-bold text-right ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            خدمات
          </h1>
          <div className="mt-5 tablet:m-10 grid grid-cols-1 laptop:grid-cols-2 gap-6">
            {data.services.map((service, index) => (
              <ServiceCard
                key={index}
                name={service.title}
                description={service.description}
              />
            ))}
          </div>
        </div>
        {/* Edit button - only shown when logged in */}
        {isAuthenticated && (
          <div className="fixed bottom-5 left-5">
            <Link href="/edit">
              <Button type="primary">ویرایش</Button>
            </Link>
          </div>
        )}
        <div className="mt-10 laptop:mt-40 p-2 laptop:p-0" ref={aboutRef}>
          <h1
            className={`tablet:m-10 text-2xl text-bold text-right ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            درباره ما
          </h1>
          <p
            className={`tablet:m-10 mt-2 text-xl laptop:text-3xl w-full laptop:w-3/5 text-right ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
            style={{ textAlign: "right" }}
          >
            {data.aboutpara}
          </p>
        </div>
        <Footer />
      </div>
    </div>
  );
}
