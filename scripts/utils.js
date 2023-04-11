import React from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import hljs from 'highlight.js';
import ReactMarkdown from 'react-markdown';
import { setHljs } from 'markdown-hljs';

export const languageAbbreviations = {
  "js": "javascript",
  "py": "python",
  "rb": "ruby",
  "java": "java",
  "cpp": "c++",
  "c": "c",
  "cs": "csharp",
  "go": "go",
  "php": "php",
  "ts": "typescript",
  "swift": "swift",
  "kotlin": "kotlin",
  "scala": "scala",
  "rs": "rust",
  "lua": "lua",
  "r": "r",
  "pl": "perl",
  "sh": "shell",
  "dart": "dart",
  "groovy": "groovy",
};

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const timeout = (duration) => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timed out')), duration);
  });
};