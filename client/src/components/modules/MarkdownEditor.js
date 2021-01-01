import React, { useState, useEffect } from "react";
import Prism from 'prismjs/components/prism-core';
import TextareaAutosize from 'react-autosize-textarea';
import MonacoEditor from "react-monaco-editor";

import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-markdown';
import 'prismjs/themes/prism-tomorrow.css'

function MarkdownEditor(props) {
  useEffect(() => {
    Prism.highlightAll();
  }, [props.content]);

  const options = {};

  return (
      <MonacoEditor
        height="600"
        language="markdown"
        theme="vs-dark"
        value={props.content}
        options={options}
        onChange={props.onChange}
      />
  );
};

export default MarkdownEditor;
