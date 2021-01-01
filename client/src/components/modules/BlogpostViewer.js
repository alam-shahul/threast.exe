import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import TextareaAutosize from 'react-autosize-textarea';

import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import Tex from '@matejmazur/react-katex';
import 'katex/dist/katex.min.css';
import math from 'remark-math';

import default_thumbnail from "../../public/images/underConstruction.gif";
import { FileDisplay, FileProcessor } from "./FileProcessor.js";
import LinkButton from "./LinkButton.js";

function BlogpostViewer(props) {
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
    return <img {...props} style={{maxWidth: '100%'}} />
  }

  return (
    <>
      <div className="blogpostViewer">
        <div className="blogHeader">
          <div className="title">{props.blogpost.title}</div>
          <div className="tagline">{props.blogpost.tagline}</div>
          <div className="author">
            <Link to={"/people?id=" + props.blogpost.profileId}>
              {props.blogpost.ownerName}
            </Link>
          </div>
          <FileDisplay type="image" URL={props.blogpost.thumbnailURL || default_thumbnail}/>
        </div>
        <div className="content">
          <ReactMarkdown
            plugins={[gfm, math]}
            children={props.blogpost.content}
            renderers={{
              paragraph: renderParagraph,
              image: renderImage,
              inlineMath: ({value}) => <Tex math={value} />,
              math: ({value}) => <Tex block math={value} />
            }}
            skipHtml={false}
            escapeHtml={true}
          />
        </div>
      </div>
    </>
  );
}

export default BlogpostViewer;
