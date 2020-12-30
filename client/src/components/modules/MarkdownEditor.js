import React, { useState, useEffect } from "react";
import Prism from 'prismjs/components/prism-core';
import TextareaAutosize from 'react-autosize-textarea';
import Editor from "react-simple-code-editor";

import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-markdown';
import 'prismjs/themes/prism-tomorrow.css'

function MarkdownEditor(props) {
  useEffect(() => {
    Prism.highlightAll();
  }, [props.content]);

  return (
      <Editor
        value={props.content}
        onValueChange={props.onChange}
        highlight={code => highlight(code, languages.markdown)}
        padding={10}
        className={"editorContainer"}
        textareaClassName={"editorText"}
      />
  );
};

export default MarkdownEditor;
