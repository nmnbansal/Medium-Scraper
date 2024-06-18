import React, { useState, ChangeEvent, useEffect } from "react";
import axios from "axios";
import { FaSun, FaMoon } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";
import newspaperIcon from "../assets/newspaper-icon-removebg-preview.png";

interface Article {
  title: string;
  link: string;
  author: string;
  publicationDate: string;
}

const ArticleList: React.FC = () => {
  const [topic, setTopic] = useState<string>("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/scrape", {
        topic,
      });
      setArticles(response.data);
      setTopic("");
      setError("");
    } catch (error) {
      setError("Failed to scrape Medium articles");
    }
    setLoading(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTopic(e.target.value);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid");
  };

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div
        className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 relative"
        style={{
          fontFamily: 'sohne, "Helvetica Neue", Helvetica, Arial, sans-serif',
        }}
      >
        <div
          className="absolute rotate-3"
          style={{
            width: "97vw",
            height: "95vh",
            backgroundImage: `url(${newspaperIcon})`,
            backgroundSize: "150px",
            backgroundRepeat: "repeat",
            opacity: "0.1",
            pointerEvents: "none",
          }}
        ></div>

        <div className="container mx-auto p-4 relative z-10">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center mt-4 mb-4">
              <a
                href={window.location.pathname}
                onClick={refreshPage}
                className="flex items-center cursor-pointer"
              >
                <svg
                  className="h-10 w-auto mr-2 animate-logo"
                  viewBox="0 0 200 200"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="100" cy="100" r="100" fill="url(#gradient)" />
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#4A90E2">
                        <animate
                          attributeName="stop-color"
                          values="#4A90E2; #FF8C00; #50E3C2; #9B51E0; #4A90E2"
                          dur="5s"
                          repeatCount="indefinite"
                        />
                      </stop>
                      <stop offset="100%" stopColor="#4A90E2">
                        <animate
                          attributeName="stop-color"
                          values="#4A90E2; #9B51E0; #50E3C2; #FF8C00; #4A90E2"
                          dur="5s"
                          repeatCount="indefinite"
                        />
                      </stop>
                    </linearGradient>
                  </defs>
                </svg>
                <h1
                  className="text-2xl font-bold cursor-pointer"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #4A90E2, #9B51E0)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    color: "#4A90E2",
                  }}
                >
                  Article Scraper
                </h1>
              </a>
            </div>
            <div className="flex items-center mt-4 mb-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded shadow mr-2 flex items-center justify-center"
                onClick={toggleDarkMode}
              >
                {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded shadow flex items-center justify-center"
                onClick={toggleViewMode}
              >
                {viewMode === "grid" ? "List View" : "Grid View"}
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row mb-8 mt-4">
            <input
              type="text"
              value={topic}
              onChange={handleInputChange}
              className="flex-grow p-2 border rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 mb-2 sm:mb-0 sm:mr-2"
              placeholder="Please type here article category"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white px-4 py-2 rounded shadow"
            >
              Search
            </button>
          </div>
          {loading && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <FiLoader className="animate-spin text-blue-500" size={40} />
            </div>
          )}
          {error && <p className="text-red-500">{error}</p>}
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                : ""
            }
          >
            {articles.map((article, index) => (
              <a
                key={index}
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`block p-6 bg-white dark:bg-gray-800 rounded-lg shadow ${
                  viewMode === "list" ? "mb-4" : ""
                }`}
              >
                <h2 className="text-lg font-semibold mb-2">{article.title}</h2>
                <p className="text-sm text-gray-500 mb-2">{article.author}</p>
                <p className="text-sm text-gray-500">
                  {new Date(article.publicationDate).toLocaleDateString()}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export { ArticleList };
