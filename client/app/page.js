"use client";
import React, { useState } from "react";
import { LoadScript } from "@react-google-maps/api";
import { SourceContext } from "../context/SourceContext";
import { DestinationContext } from "../context/DestinationContext";
import SearchSection from "../components/Home/SearchSection";
import GoogleMapSection from "../components/Home/GoogleMapSection";
import axios from "axios";
import { FiMessageCircle } from "react-icons/fi"; // Chat bubble icon

export default function Home() {
  const [source, setSource] = useState([]);
  const [destination, setDestination] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false); // For toggling chat window visibility

  async function generateCon() {
    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }
    
    setLoading(true);
    setError(""); 
    setAnswer(""); 

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      const response = await axios({
        
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" +apiKey, // Replace with your API key
        method: "post",
        data: {
          contents: [
            { parts: [{ text: question }] },
          ],
        },
      });
      setAnswer(response.data.candidates[0].content.parts[0].text);
    } catch (err) {
      console.error("Error during API call:", err);
      setError("Error communicating with the AI. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SourceContext.Provider value={{ source, setSource }}>
      <DestinationContext.Provider value={{ destination, setDestination }}>
        <LoadScript
          libraries={["places", "geometry", "directions"]}
          googleMapsApiKey="AIzaSyAgva5waMWa2aNgN6GXolJkvaL_JMHPZ2A"
        >
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <SearchSection />
            </div>
            <div className="col-span-2">
              <GoogleMapSection />
            </div>
          </div>
        </LoadScript>

        {/* Floating Chatbot Icon */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="fixed bottom-10 left-10 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out animate-bounce"
        >
          <FiMessageCircle size={30} />
        </button>

        {/* Chatbot Dialog Box */}
        {isChatOpen && (
          <div className="fixed bottom-20 right-10 w-96 bg-white rounded-lg shadow-2xl p-4 transform transition-all animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Chat with AI</h3>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-lg"
              >
                &times;
              </button>
            </div>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask something..."
              className="w-full p-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <button
              onClick={generateCon}
              className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Answer"}
            </button>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {answer && <p className="mt-4 text-gray-700">{answer}</p>}
          </div>
        )}
      </DestinationContext.Provider>
    </SourceContext.Provider>
  );
}
