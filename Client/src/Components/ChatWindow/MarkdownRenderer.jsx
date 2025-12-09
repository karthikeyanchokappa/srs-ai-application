// src/Components/ChatWindow/MarkdownRenderer.jsx

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight"; // ⭐ Syntax highlight
import "highlight.js/styles/github-dark.css";   // ⭐ Dark theme code block styling

const MarkdownRenderer = ({ text }) => {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
