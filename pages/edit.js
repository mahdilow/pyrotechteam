import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import Header from "../components/Header";
import { v4 as uuidv4 } from "uuid";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";

// Data
import yourData from "../data/portfolio.json";
import Cursor from "../components/Cursor";

const Edit = () => {
  // states
  const [data, setData] = useState(yourData);
  const [originalData, setOriginalData] = useState(yourData);
  const [currentTabs, setCurrentTabs] = useState("HEADER");
  const [mounted, setMounted] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const { theme } = useTheme();
  const router = useRouter();
  
  // Check authentication when component mounts
  useEffect(() => {
    setMounted(true);
    const isAuthenticated = sessionStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      router.push("/login");
    }
    
    // Deep copy the original data for comparison
    setOriginalData(JSON.parse(JSON.stringify(yourData)));
  }, [router]);
  
  // Check for unsaved changes
  useEffect(() => {
    if (JSON.stringify(data) !== JSON.stringify(originalData)) {
      setUnsavedChanges(true);
    } else {
      setUnsavedChanges(false);
    }
  }, [data, originalData]);

  const saveData = () => {
    if (process.env.NODE_ENV === "development") {
      setSaveMessage("در حال ذخیره تغییرات...");
      
      fetch("/api/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      .then(response => {
        if (response.ok) {
          setSaveMessage("تغییرات با موفقیت ذخیره شد");
          setOriginalData(JSON.parse(JSON.stringify(data)));
          setUnsavedChanges(false);
          
          // Clear success message after 3 seconds
          // Show success message for 3 seconds then fade away
          setTimeout(() => {
            setSaveMessage("");
          }, 3000);
        } else {
          setSaveMessage("خطا در ذخیره تغییرات");
        }
      })
      .catch(error => {
        console.error("Error saving data:", error);
        setSaveMessage("خطا در ذخیره تغییرات");
      });
    } else {
      alert("This thing only works in development mode.");
    }
  };
  
  const discardChanges = () => {
    if (window.confirm("آیا مطمئن هستید که می‌خواهید تغییرات را لغو کنید؟")) {
      setData(JSON.parse(JSON.stringify(originalData)));
      setUnsavedChanges(false);
      setSaveMessage("تغییرات لغو شد");
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setSaveMessage("");
      }, 3000);
    }
  };

  // Project Handler
  const editProjects = (projectIndex, editProject) => {
    let copyProjects = data.projects;
    copyProjects[projectIndex] = { ...editProject };
    setData({ ...data, projects: copyProjects });
  };

  const addProject = () => {
    setData({
      ...data,
      projects: [
        ...data.projects,
        {
          id: uuidv4(),
          title: "New Project",
          description: "Web Design & Development",
          imageSrc:
            "https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTAyfHxwYXN0ZWx8ZW58MHx8MHw%3D&auto=format&fit=crop&w=400&q=60",

          url: "http://chetanverma.com/",
        },
      ],
    });
  };

  const deleteProject = (id) => {
    const copyProjects = data.projects;
    copyProjects = copyProjects.filter((project) => project.id !== id);
    setData({ ...data, projects: copyProjects });
  };

  // Services Handler

  const editServices = (serviceIndex, editService) => {
    let copyServices = data.services;
    copyServices[serviceIndex] = { ...editService };
    setData({ ...data, services: copyServices });
  };

  const addService = () => {
    setData({
      ...data,
      services: [
        ...data.services,
        {
          id: uuidv4(),
          title: "New Service",
          description:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ",
        },
      ],
    });
  };

  const deleteService = (id) => {
    const copyServices = data.services;
    copyServices = copyServices.filter((service) => service.id !== id);
    setData({ ...data, services: copyServices });
  };

  // Socials Handler

  const editSocials = (socialIndex, editSocial) => {
    let copySocials = data.socials;
    copySocials[socialIndex] = { ...editSocial };
    setData({ ...data, socials: copySocials });
  };

  const addSocials = () => {
    setData({
      ...data,
      socials: [
        ...data.socials,
        {
          id: uuidv4(),
          title: "New Link",
          link: "www.chetanverma.com",
        },
      ],
    });
  };

  const deleteSocials = (id) => {
    const copySocials = data.socials;
    copySocials = copySocials.filter((social) => social.id !== id);
    setData({ ...data, socials: copySocials });
  };

  // Resume

  const handleAddExperiences = () => {
    setData({
      ...data,
      resume: {
        ...data.resume,
        experiences: [
          ...data.resume.experiences,
          {
            id: uuidv4(),
            dates: "Enter Dates",
            type: "Full Time",
            position: "Frontend Engineer at X",
            bullets: ["Worked on the frontend of a React application"],
          },
        ],
      },
    });
  };

  const handleEditExperiences = (index, editExperience) => {
    let copyExperiences = data.resume.experiences;
    copyExperiences[index] = { ...editExperience };
    setData({
      ...data,
      resume: { ...data.resume, experiences: copyExperiences },
    });
  };

  // Don't render until authentication is checked
  if (!mounted) {
    return null;
  }
  
  return (
    <div className={`container mx-auto ${data.showCursor && "cursor-none"}`} style={{ direction: "rtl" }}>
      <Header isBlog></Header>
      {data.showCursor && <Cursor />}
      <div className="mt-10">
        <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} p-4 rounded-lg shadow-md`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between w-full">
              <h1 className={`text-4xl ${theme === "dark" ? "text-white" : "text-gray-800"}`}>پنل مدیریت</h1>
              
              {saveMessage && (
                <div className={`mr-4 py-2 px-4 rounded-md transition-opacity duration-500 ${saveMessage.includes("خطا") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                  {saveMessage}
                </div>
              )}
              
              <div className="flex items-center">
                {unsavedChanges && (
                  <Button 
                    onClick={discardChanges} 
                    classes="ml-2 bg-gray-500 hover:bg-gray-600 text-white">
                    لغو تغییرات
                  </Button>
                )}
                <Button 
                  onClick={() => {
                    sessionStorage.removeItem("isAuthenticated");
                    router.push("/");
                  }} 
                  classes="ml-2 bg-red-500 hover:bg-red-600 text-white">
                  خروج
                </Button>
                <Button 
                  onClick={saveData} 
                  type="primary"
                  disabled={!unsavedChanges}
                  classes={!unsavedChanges ? "opacity-50 cursor-not-allowed" : ""}>
                  ذخیره
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center flex-wrap mt-4">
            <Button
              onClick={() => setCurrentTabs("HEADER")}
              type={currentTabs === "HEADER" && "primary"}
              classes={`m-1 ${theme === "dark" ? (currentTabs !== "HEADER" ? "text-white bg-gray-700" : "") : ""}`}
            >
              سربرگ
            </Button>
            <Button
              onClick={() => setCurrentTabs("PROJECTS")}
              type={currentTabs === "PROJECTS" && "primary"}
              classes={`m-1 ${theme === "dark" ? (currentTabs !== "PROJECTS" ? "text-white bg-gray-700" : "") : ""}`}
            >
              پروژه‌ها
            </Button>
            <Button
              onClick={() => setCurrentTabs("SERVICES")}
              type={currentTabs === "SERVICES" && "primary"}
              classes={`m-1 ${theme === "dark" ? (currentTabs !== "SERVICES" ? "text-white bg-gray-700" : "") : ""}`}
            >
              خدمات
            </Button>
            <Button
              onClick={() => setCurrentTabs("ABOUT")}
              type={currentTabs === "ABOUT" && "primary"}
              classes={`m-1 ${theme === "dark" ? (currentTabs !== "ABOUT" ? "text-white bg-gray-700" : "") : ""}`}
            >
              درباره من
            </Button>
            <Button
              onClick={() => setCurrentTabs("SOCIAL")}
              type={currentTabs === "SOCIAL" && "primary"}
              classes={`m-1 ${theme === "dark" ? (currentTabs !== "SOCIAL" ? "text-white bg-gray-700" : "") : ""}`}
            >
              شبکه‌های اجتماعی
            </Button>
            <Button
              onClick={() => setCurrentTabs("RESUME")}
              type={currentTabs === "RESUME" && "primary"}
              classes={`m-1 ${theme === "dark" ? (currentTabs !== "RESUME" ? "text-white bg-gray-700" : "") : ""}`}
            >
              رزومه
            </Button>
          </div>
        </div>
        {/* HEADER */}
        {currentTabs === "HEADER" && (
          <div className="mt-10">
            <div className="flex items-center">
              <label className="w-1/5 text-lg opacity-70">نام</label>
              <input
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className={`w-4/5 mr-10 p-2 rounded-md shadow-lg border-2 ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"}`}
                type="text"
                dir="rtl"
              ></input>
            </div>
            
            <div className="mt-5">
              <label className="text-lg opacity-70 block mb-2">لوگو</label>
              <div className="flex items-start space-x-4 space-x-reverse">
                <div className="flex-grow">
                  <input
                    value={data.logo}
                    onChange={(e) => setData({ ...data, logo: e.target.value })}
                    className={`w-full p-2 rounded-md shadow-lg border-2 ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"}`}
                    type="text"
                    dir="rtl"
                    placeholder="آدرس URL تصویر لوگو یا کد base64"
                  />
                </div>
                <label className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 mr-2">
                  <span>آپلود فایل</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setData({ ...data, logo: reader.result });
                        };
                        reader.readAsDataURL(file);
                      }
                    }} 
                  />
                </label>
              </div>
              {data.logo && (
                <div className="mt-2">
                  <p className={`${theme === "dark" ? "text-white" : "text-gray-800"} mb-2`}>پیش‌نمایش:</p>
                  <img 
                    src={data.logo} 
                    alt="Logo Preview" 
                    className="h-16 object-contain rounded-md" 
                  />
                </div>
              )}
            </div>
            <div className="mt-5 flex items-center">
              <label className="w-1/5 text-lg opacity-70">
                خط اول سربرگ
              </label>
              <input
                value={data.headerTaglineOne}
                onChange={(e) =>
                  setData({ ...data, headerTaglineOne: e.target.value })
                }
                className={`w-4/5 mr-10 p-2 rounded-md shadow-lg border-2 ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"}`}
                type="text"
                dir="rtl"
              ></input>
            </div>
            <div className="mt-5 flex items-center">
              <label className="w-1/5 text-lg opacity-70">
                خط دوم سربرگ
              </label>
              <input
                value={data.headerTaglineTwo}
                onChange={(e) =>
                  setData({ ...data, headerTaglineTwo: e.target.value })
                }
                className={`w-4/5 mr-10 p-2 rounded-md shadow-lg border-2 ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"}`}
                type="text"
                dir="rtl"
              ></input>
            </div>
            <div className="mt-5 flex items-center">
              <label className="w-1/5 text-lg opacity-70">
                خط سوم سربرگ
              </label>
              <input
                value={data.headerTaglineThree}
                onChange={(e) =>
                  setData({ ...data, headerTaglineThree: e.target.value })
                }
                className={`w-4/5 mr-10 p-2 rounded-md shadow-lg border-2 ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"}`}
                type="text"
                dir="rtl"
              ></input>
            </div>
            <div className="mt-5 flex items-center">
              <label className="w-1/5 text-lg opacity-70">
                خط چهارم سربرگ
              </label>
              <input
                value={data.headerTaglineFour}
                onChange={(e) =>
                  setData({ ...data, headerTaglineFour: e.target.value })
                }
                className={`w-4/5 mr-10 p-2 rounded-md shadow-lg border-2 ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"}`}
                type="text"
                dir="rtl"
              ></input>
            </div>
            <div className="mt-5 flex items-center">
              <label className="w-1/5 text-lg opacity-70">بلاگ</label>
              <div className="w-4/5 mr-10 flex items-center">
                <Button
                  onClick={() => setData({ ...data, showBlog: true })}
                  type={data.showBlog && "primary"}
                >
                  بله
                </Button>
                <Button
                  onClick={() => setData({ ...data, showBlog: false })}
                  classes={
                    !data.showBlog && "bg-red-500 text-white hover:bg-red-600"
                  }
                >
                  خیر
                </Button>
              </div>
            </div>
            <div className="mt-5 flex items-center">
              <label className="w-1/5 text-lg opacity-70">حالت تاریک</label>
              <div className="w-4/5 mr-10 flex items-center">
                <Button
                  onClick={() => setData({ ...data, darkMode: true })}
                  type={data.darkMode && "primary"}
                >
                  بله
                </Button>
                <Button
                  onClick={() => setData({ ...data, darkMode: false })}
                  classes={
                    !data.darkMode && "bg-red-500 text-white hover:bg-red-600"
                  }
                >
                  خیر
                </Button>
              </div>
            </div>
            <div className="mt-5 flex items-center">
              <label className="w-1/5 text-lg opacity-70">نمایش رزومه</label>
              <div className="w-4/5 mr-10 flex items-center">
                <Button
                  onClick={() => setData({ ...data, showResume: true })}
                  type={data.showResume && "primary"}
                >
                  بله
                </Button>
                <Button
                  onClick={() => setData({ ...data, showResume: false })}
                  classes={
                    !data.showResume && "bg-red-500 text-white hover:bg-red-600"
                  }
                >
                  خیر
                </Button>
              </div>
            </div>
            <div className="mt-5 flex items-center">
              <label className="w-1/5 text-lg opacity-70">نشانگر سفارشی</label>
              <div className="w-4/5 mr-10 flex items-center">
                <Button
                  onClick={() => setData({ ...data, showCursor: true })}
                  type={data.showCursor && "primary"}
                >
                  بله
                </Button>
                <Button
                  onClick={() => setData({ ...data, showCursor: false })}
                  classes={
                    !data.showCursor && "bg-red-500 text-white hover:bg-red-600"
                  }
                >
                  خیر
                </Button>
              </div>
            </div>
          </div>
        )}
        {/* PROJECTS */}
        {currentTabs === "PROJECTS" && (
          <>
            <div className="mt-10">
              {data.projects.map((project, index) => (
                <div className="mt-10" key={project.id}>
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl">{project.title}</h1>
                    <Button
                      onClick={() => deleteProject(project.id)}
                      type="primary"
                    >
                      Delete
                    </Button>
                  </div>

                  <div className="flex items-center mt-5">
                    <label className="w-1/5 text-lg opacity-50">Title</label>
                    <input
                      value={project.title}
                      onChange={(e) =>
                        editProjects(index, {
                          ...project,
                          title: e.target.value,
                        })
                      }
                      className="w-4/5 ml-10 p-2 rounded-md shadow-lg border-2"
                      type="text"
                    ></input>
                  </div>
                  <div className="flex items-center mt-2">
                    <label className="w-1/5 text-lg opacity-50">
                      Description
                    </label>
                    <input
                      value={project.description}
                      onChange={(e) =>
                        editProjects(index, {
                          ...project,
                          description: e.target.value,
                        })
                      }
                      className="w-4/5 ml-10 p-2 rounded-md shadow-lg border-2"
                      type="text"
                    ></input>
                  </div>
                  <div className="flex flex-col mt-2">
                    <label className="text-lg opacity-50 mb-2">
                      Image Source
                    </label>
                    <div className="flex items-start space-x-4">
                      <div className="flex-grow">
                        <input
                          value={project.imageSrc}
                          onChange={(e) =>
                            editProjects(index, {
                              ...project,
                              imageSrc: e.target.value,
                            })
                          }
                          className="w-full p-2 rounded-md shadow-lg border-2"
                          type="text"
                          placeholder="آدرس URL تصویر یا کد base64"
                        />
                      </div>
                      <label className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 ml-2">
                        <span>آپلود فایل</span>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                editProjects(index, {
                                  ...project,
                                  imageSrc: reader.result,
                                });
                              };
                              reader.readAsDataURL(file);
                            }
                          }} 
                        />
                      </label>
                    </div>
                    {project.imageSrc && (
                      <div className="mt-2">
                        <p className="mb-1">پیش‌نمایش:</p>
                        <img 
                          src={project.imageSrc} 
                          alt={project.title} 
                          className="h-24 object-cover rounded-md" 
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center mt-2">
                    <label className="w-1/5 text-lg opacity-50">url</label>
                    <input
                      value={project.url}
                      onChange={(e) =>
                        editProjects(index, {
                          ...project,
                          url: e.target.value,
                        })
                      }
                      className="w-4/5 ml-10 p-2 rounded-md shadow-lg border-2"
                      type="text"
                    ></input>
                  </div>
                  <hr className="my-10"></hr>
                </div>
              ))}
            </div>

            <div className="my-10">
              <Button onClick={addProject} type="primary">
                Add Project +
              </Button>
            </div>
          </>
        )}
        {/* SERVICES */}
        {currentTabs === "SERVICES" && (
          <>
            <div className="mt-10">
              {data.services.map((service, index) => (
                <div key={service.id}>
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl">{service.title}</h1>
                    <Button
                      onClick={() => deleteService(service.id)}
                      type="primary"
                    >
                      Delete
                    </Button>
                  </div>
                  <div className="flex items-center mt-5">
                    <label className="w-1/5 text-lg opacity-50">Title</label>
                    <input
                      value={service.title}
                      onChange={(e) =>
                        editServices(index, {
                          ...service,
                          title: e.target.value,
                        })
                      }
                      className="w-4/5 ml-10 p-2 rounded-md shadow-lg border-2"
                      type="text"
                    ></input>
                  </div>
                  <div className="flex items-center mt-5">
                    <label className="w-1/5 text-lg opacity-50">
                      Description
                    </label>
                    <textarea
                      value={service.description}
                      onChange={(e) =>
                        editServices(index, {
                          ...service,
                          description: e.target.value,
                        })
                      }
                      className="w-4/5 ml-10 p-2 rounded-md shadow-lg border-2"
                    ></textarea>
                  </div>
                  <hr className="my-10"></hr>
                </div>
              ))}
            </div>
            <div className="my-10">
              <Button onClick={addService} type="primary">
                Add Service +
              </Button>
            </div>
          </>
        )}
        {currentTabs === "ABOUT" && (
          <div className="mt-10">
            <h1 className="text-2xl">About</h1>
            <textarea
              className="w-full h-96 mt-10 p-2 rounded-md shadow-md border"
              value={data.aboutpara}
              onChange={(e) => setData({ ...data, aboutpara: e.target.value })}
            ></textarea>
          </div>
        )}
        {currentTabs === "SOCIAL" && (
          <div className="mt-10">
            {data.socials.map((social, index) => (
              <>
                <div key={social.id}>
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl">{social.title}</h1>
                    <Button
                      onClick={() => deleteSocials(social.id)}
                      type="primary"
                    >
                      Delete
                    </Button>
                  </div>
                  <div className="flex items-center mt-5">
                    <label className="w-1/5 text-lg opacity-50">Title</label>
                    <input
                      value={social.title}
                      onChange={(e) =>
                        editSocials(index, {
                          ...social,
                          title: e.target.value,
                        })
                      }
                      className="w-4/5 ml-10 p-2 rounded-md shadow-lg border-2"
                      type="text"
                    ></input>
                  </div>
                  <div className="flex items-center mt-5">
                    <label className="w-1/5 text-lg opacity-50">Link</label>
                    <input
                      value={social.link}
                      onChange={(e) =>
                        editSocials(index, {
                          ...social,
                          link: e.target.value,
                        })
                      }
                      className="w-4/5 ml-10 p-2 rounded-md shadow-lg border-2"
                      type="text"
                    />
                  </div>
                  <hr className="my-10"></hr>
                </div>
              </>
            ))}
            <div className="my-10">
              <Button onClick={addSocials} type="primary">
                Add Social +
              </Button>
            </div>
          </div>
        )}
        {currentTabs === "RESUME" && (
          <div className="mt-10">
            <h1>Main</h1>
            <div className="mt-5 flex items-center">
              <label className="w-1/5 text-sx opacity-50">Tagline</label>
              <input
                value={data.resume.tagline}
                onChange={(e) =>
                  setData({
                    ...data,
                    resume: { ...data.resume, tagline: e.target.value },
                  })
                }
                className="w-4/5 ml-10 p-2 rounded-md shadow-lg border-2"
                type="text"
              ></input>
            </div>
            <div className="flex items-center mt-5">
              <label className="w-1/5 text-lg opacity-50">Description</label>
              <textarea
                value={data.resume.description}
                onChange={(e) =>
                  setData({
                    ...data,
                    resume: { ...data.resume, description: e.target.value },
                  })
                }
                className="w-4/5 ml-10 p-2 rounded-md shadow-lg border-2"
              ></textarea>
            </div>
            <hr className="my-10"></hr>

            <h1>Experiences</h1>
            <div className="mt-10">
              {data.resume.experiences.map((experiences, index) => (
                <div className="mt-5" key={experiences.id}>
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl">{experiences.position}</h1>
                    <Button
                      // onClick={() => deleteProject(project.id)}
                      type="primary"
                    >
                      Delete
                    </Button>
                  </div>

                  <div className="flex items-center mt-5">
                    <label className="w-1/5 text-lg opacity-50">Dates</label>
                    <input
                      value={experiences.dates}
                      onChange={(e) =>
                        handleEditExperiences(index, {
                          ...experiences,
                          dates: e.target.value,
                        })
                      }
                      className="w-4/5 ml-10 p-2 rounded-md shadow-lg border-2"
                      type="text"
                    ></input>
                  </div>
                  <div className="flex items-center mt-2">
                    <label className="w-1/5 text-lg opacity-50">Type</label>
                    <input
                      value={experiences.type}
                      onChange={(e) =>
                        handleEditExperiences(index, {
                          ...experiences,
                          type: e.target.value,
                        })
                      }
                      className="w-4/5 ml-10 p-2 rounded-md shadow-lg border-2"
                      type="text"
                    ></input>
                  </div>
                  <div className="flex items-center mt-2">
                    <label className="w-1/5 text-lg opacity-50">Position</label>
                    <input
                      value={experiences.position}
                      onChange={(e) =>
                        handleEditExperiences(index, {
                          ...experiences,
                          position: e.target.value,
                        })
                      }
                      className="w-4/5 ml-10 p-2 rounded-md shadow-lg border-2"
                      type="text"
                    ></input>
                  </div>
                  <div className="mt-2 flex">
                    <label className="w-1/5 text-lg opacity-50">Bullets</label>
                    <div className="w-4/5 ml-10 flex flex-col">
                      <input
                        value={experiences.bullets}
                        onChange={(e) =>
                          handleEditExperiences(index, {
                            ...experiences,
                            bullets: e.target.value,
                          })
                        }
                        placeholder="Bullet One, Bullet Two, Bullet Three"
                        className="p-2 rounded-md shadow-lg border-2"
                        type="text"
                      ></input>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="my-10">
              <Button onClick={handleAddExperiences} type="primary">
                Add Experience +
              </Button>
            </div>
            <hr className="my-10"></hr>
            <div className="mt-10">
              <h1>Education</h1>
              <div className="flex items-center mt-5">
                <label className="w-1/5 text-lg opacity-50">Name</label>
                <input
                  value={data.resume.education.universityName}
                  onChange={(e) =>
                    setData({
                      ...data,
                      resume: {
                        ...data.resume,
                        education: {
                          ...data.resume.education,
                          universityName: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-4/5 ml-10 p-2 rounded-md shadow-lg border-2"
                  type="text"
                ></input>
              </div>
              <div className="flex items-center mt-5">
                <label className="w-1/5 text-lg opacity-50">Dates</label>
                <input
                  value={data.resume.education.universityDate}
                  onChange={(e) =>
                    setData({
                      ...data,
                      resume: {
                        ...data.resume,
                        education: {
                          ...data.resume.education,
                          universityDate: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-4/5 ml-10 p-2 rounded-md shadow-lg border-2"
                  type="text"
                ></input>
              </div>
              <div className="flex items-center mt-5">
                <label className="w-1/5 text-lg opacity-50">Detail</label>
                <input
                  value={data.resume.education.universityPara}
                  onChange={(e) =>
                    setData({
                      ...data,
                      resume: {
                        ...data.resume,
                        education: {
                          ...data.resume.education,
                          universityPara: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-4/5 ml-10 p-2 rounded-md shadow-lg border-2"
                  type="text"
                ></input>
              </div>
            </div>
            <hr className="my-10"></hr>
            <div className="mt-10">
              <div className="flex">
                <label className="w-1/5 text-lg opacity-50">Languages</label>
                <div className="w-4/5 ml-10 flex flex-col">
                  {data.resume.languages.map((language, index) => (
                    <div key={index} className="flex">
                      <input
                        value={language}
                        onChange={(e) => {
                          setData({
                            ...data,
                            resume: {
                              ...data.resume,
                              languages: [
                                ...data.resume.languages.slice(0, index),
                                e.target.value,
                                ...data.resume.languages.slice(index + 1),
                              ],
                            },
                          });
                        }}
                        className="w-full p-2 rounded-md shadow-lg border-2"
                        type="text"
                      ></input>
                      <Button
                        onClick={() =>
                          setData({
                            ...data,
                            resume: {
                              ...data.resume,
                              languages: data.resume.languages.filter(
                                (value, i) => index !== i
                              ),
                            },
                          })
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="primary"
                    classes="hover:scale-100"
                    onClick={() =>
                      setData({
                        ...data,
                        resume: {
                          ...data.resume,
                          languages: [...data.resume.languages, "Added"],
                        },
                      })
                    }
                  >
                    Add +
                  </Button>
                </div>
              </div>
              <hr className="my-10"></hr>
              <div className="flex">
                <label className="w-1/5 text-lg opacity-50">Frameworks</label>
                <div className="w-4/5 ml-10 flex flex-col">
                  {data.resume.frameworks.map((framework, index) => (
                    <div key={index} className="flex">
                      <input
                        value={framework}
                        onChange={(e) => {
                          setData({
                            ...data,
                            resume: {
                              ...data.resume,
                              frameworks: [
                                ...data.resume.frameworks.slice(0, index),
                                e.target.value,
                                ...data.resume.frameworks.slice(index + 1),
                              ],
                            },
                          });
                        }}
                        className="w-full p-2 rounded-md shadow-lg border-2"
                        type="text"
                      ></input>
                      <Button
                        onClick={() =>
                          setData({
                            ...data,
                            resume: {
                              ...data.resume,
                              frameworks: data.resume.frameworks.filter(
                                (value, i) => index !== i
                              ),
                            },
                          })
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    onClick={() =>
                      setData({
                        ...data,
                        resume: {
                          ...data.resume,
                          frameworks: [...data.resume.frameworks, "Added"],
                        },
                      })
                    }
                    type="primary"
                    classes="hover:scale-100"
                  >
                    Add +
                  </Button>
                </div>
              </div>
              <hr className="my-10"></hr>
              <div className="flex">
                <label className="w-1/5 text-lg opacity-50">Others</label>
                <div className="w-4/5 ml-10 flex flex-col">
                  {data.resume.others.map((other, index) => (
                    <div key={index} className="flex">
                      <input
                        value={other}
                        onChange={(e) => {
                          setData({
                            ...data,
                            resume: {
                              ...data.resume,
                              others: [
                                ...data.resume.others.slice(0, index),
                                e.target.value,
                                ...data.resume.others.slice(index + 1),
                              ],
                            },
                          });
                        }}
                        className="w-full p-2 rounded-md shadow-lg border-2"
                        type="text"
                      ></input>
                      <Button
                        onClick={() =>
                          setData({
                            ...data,
                            resume: {
                              ...data.resume,
                              others: data.resume.others.filter(
                                (value, i) => index !== i
                              ),
                            },
                          })
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    onClick={() =>
                      setData({
                        ...data,
                        resume: {
                          ...data.resume,
                          others: [...data.resume.others, "Added"],
                        },
                      })
                    }
                    type="primary"
                    classes="hover:scale-100"
                  >
                    Add +
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Edit;
