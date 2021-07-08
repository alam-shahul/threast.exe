import React, { useState, useEffect } from "react";
import Prism from 'prismjs/components/prism-core';
import TextareaAutosize from 'react-autosize-textarea';
import MonacoEditor from "react-monaco-editor";

function MarkdownEditor(props) {
  const [markdownEditor, setMarkdownEditor] = useState(null);

  function editorDidMount(editor, monaco) {
    console.log('editorDidMount', editor, monaco);
    setMarkdownEditor(editor);
  }

  function handleResize() {
    markdownEditor.layout();
  }

  useEffect(() => {
    // initiate the event handler
    window.addEventListener("resize", handleResize)

    // this will clean up the event every time the component is re-rendered
    return function cleanup() {
      window.removeEventListener("resize", handleResize);
    }
  })

  const options = {
    scrollbar: {
      alwaysConsumeMouseWheel: false,
    },
    wordWrap: "on",
  };

  return (
      <MonacoEditor
        height="50vh"
        language="markdown"
        theme="vs-dark"
        value={props.content}
        options={options}
        onChange={props.onChange}
        editorDidMount={editorDidMount}
      />
  );
};

export default MarkdownEditor;
