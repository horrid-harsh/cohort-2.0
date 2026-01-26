import { useEffect, useState } from "react"
import Markdown from "react-markdown"
import MacWindow from "./MacWindow";
import './note.scss'
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const Note = ({ windowName, setWindowsState }) => {

    const [markdown, setMarkdown] = useState(null);

    useEffect(() => {
        // Fetch the local note.txt file when the component mounts
        fetch('./note.txt')
            // Convert the response stream into plain text
            .then(res => res.text())
            // Store the fetched text content into component state
            .then(text => setMarkdown(text))
    }, [])


  return (
    <MacWindow windowName={windowName} setWindowsState={setWindowsState} >
        <div className="note-window">
            {markdown ? <SyntaxHighlighter language="typescript" style={docco}>{markdown}</SyntaxHighlighter> : <p>Loading...</p>}
        </div>
    </MacWindow>
  )
}

export default Note