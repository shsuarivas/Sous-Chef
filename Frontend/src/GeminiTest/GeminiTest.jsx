import styles from './geminitest.module.scss'
import { useGeminiLive } from "../GeminiLive/usingGemini";

export default function GeminiTest() {
  const { status, transcript, connect, disconnect } = useGeminiLive();

  return (
    <div className={styles.page_container}>
      <h2>Gemini Live Voice Chat</h2>
    
      <div className="mb-4">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            status === "active"
              ? "bg-green-100 text-green-800"
              : status === "connecting"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {status}
        </span>
      </div>
          
      {status === "idle" || status === "error" ? (
        <button className = {styles.button}
          onClick={connect}
        >
          Start Conversation
        </button>
      ) : (
        <button className = {styles.button}
          onClick={disconnect}
        >
          End Conversation
        </button>
      )}

      {transcript.user && (
        <div className="mt-4 p-3 bg-gray-50 rounded">
          <p className="text-xs text-gray-500 mb-1">You said:</p>
          <p>{transcript.user}</p>
        </div>
      )}
      {transcript.model && (
        <div className="mt-2 p-3 bg-blue-50 rounded">
          <p className="text-xs text-blue-500 mb-1">Gemini said:</p>
          <p>{transcript.model}</p>
        </div>
      )}
    </div>
  );
}