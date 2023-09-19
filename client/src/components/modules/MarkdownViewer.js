import React, { useState, useEffect } from "react";

import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import Tex from '@matejmazur/react-katex';
import 'katex/dist/katex.min.css';
import math from 'remark-math';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {vscDarkPlus} from 'react-syntax-highlighter/dist/esm/styles/prism';

function MarkdownViewer(props) {
  function renderParagraph(props) {
    const { children } = props;
  
    if (children && children[0]
      && children.length === 1
      && children[0].props
      && children[0].props.src) { // rendering media without p wrapper
  
      return children;
    }
  
    return <p>{children}</p>;
  }

  function renderImage(props) {
    return (
      <div style={{textAlign: "center"}}>
        <img {...props} style={{maxWidth: '50%'}} />
      </div>
    )
  }

  function renderTable(props) {
    return (
      <div style={{textAlign: "center", display: "flex", flexDirection: "row", justifyContent: "center"}}>
        <table {...props} style={{maxWidth: "75%"}}></table>
      </div>
    )
  }

  return (
          <ReactMarkdown
            plugins={[gfm, math]}
            children={props.content}
            renderers={{
              paragraph: renderParagraph,
              code: ({language, value}) => <SyntaxHighlighter style={vscDarkPlus} language={language} children={value} />,
              image: renderImage,
              inlineMath: ({value}) => <Tex math={value} />,
              math: ({value}) => <Tex block math={value} />,
              table: renderTable
            }}
            skipHtml={false}
          />
  )
}

export default MarkdownViewer;
