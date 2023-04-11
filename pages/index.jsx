import Head from 'next/head';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { makeStyles } from '@mui/styles';
import React, { useState, useEffect, useRef } from 'react';
import List from '@mui/material/List';
import {
  delay,
  languageAbbreviations,
  timeout,
} from '../scripts/utils';
import {
  loadMessages,
  clearMessages,
  saveMessages,
} from '../scripts/api/backend';

import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import hljs from 'highlight.js';
import ReactMarkdown from 'react-markdown'; 
import { setHljs } from 'markdown-hljs';

import { send } from '../scripts/api/backend';

import Message from '@/components/message';

const MAX_TIMEOUT = 1000 * 60 * 3; // 3 minutes of us waiting for response

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#434654',
  },
  headBG: {
    backgroundColor: '#434654',
  }, 
  messageArea: {
    height: '85vh',
    overflowY: 'auto',
    backgroundColor: '#434654',
  },
});


export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const loadedMessages = await loadMessages();
        setMessages(loadedMessages);
      } catch (err) {
        console.error('Error loading messages:', err);
      }
    })();
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleClose = (
    event,
    reason
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setAlertMessage('');
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const scrollToBottom = () => {
    bottomRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    const newMessage = {
      id: messages.length,
      content: inputValue,
      type: 'Q',
    };
    setInputValue('');

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    // a mechanism to simulate the assistant typing while we wait for server to respond
    var response;
    await delay(250).then(
    () => setIsAssistantTyping(true));
    try {
      response = (await Promise.race([
        send(inputValue),
        timeout(MAX_TIMEOUT), // Set the duration (in milliseconds) for the maximum time allowed for the API response
      ]));
    } catch (error) {
      console.error('Error retrieving response from server:', error);
      setAlertMessage('Timed out waiting for response from server.');
    }

    setIsAssistantTyping(false);

    await delay(200);

    if (response != null) {
      response.id = updatedMessages.length;
      setMessages([...updatedMessages, response]);
    } else {
      setAlertMessage('Error retrieving response from server. Please try again later.');
    }

    try {
      await saveMessages([...updatedMessages, response]);
    } catch (err) {
      console.error('Error saving messages:', err);
    }
  };

  const handleClearConvo = async () => {
    setMessages([]);
    
    try {
      await clearMessages();
      setMessages([]);
    } catch (err) {
      console.error('Error clearing messages:', err);
    }
    setAlertMessage('Conversation cleared.');
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.shiftKey && e.key === 'Delete') {
        handleClearConvo();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Tab' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      const textarea = e.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      setInputValue(inputValue.slice(0, start) + '\t' + inputValue.slice(end));
      textarea.selectionStart = textarea.selectionEnd = start + 1;
    }
    else if (e.key === 'Enter' && !e.shiftKey && inputValue !== '') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // markdown rendering
  function renderMessage(message) {
    var result;
    if (message.includes('```')) {
      const renderers = {
        code: ({ language, value }) => {
          if (languageAbbreviations.hasOwnProperty(language)) {
            language = languageAbbreviations[language];
          }

          return (
            <SyntaxHighlighter language={language}>
              {value}
            </SyntaxHighlighter>
          );
        },
      };
      result = (
        <ReactMarkdown renderers={renderers}>{message}</ReactMarkdown>
      );
    } else {
      result = <ReactMarkdown>{message}</ReactMarkdown>;
    }
    return result;
  }  

  const classes = useStyles();
  return (
    <>
      <Head>
        <title>GinettePT</title>
        <meta name="description" content="A simple front end for Chat GPT" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#434654"></meta>
        <link rel="icon" href="./assets/ginette.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Grid
        container
        className={classes.chatSection}
        sx={{ minHeight: '100vh', bgColor: '#434654' }}
      >
        <Grid item xs={12}>
          <List className={classes.messageArea} sx={{ minHeight: '80vh' }}>
          {messages.map((message, index) => (
            message ? (
              <Message
                key={message.id  }
                content={renderMessage(message.content ?? "")}
                type={message.type ?? "Q"}
              />
            ) : null
          ))}
          </List>
          <Grid
            item
            xs={12}
            style={{ textAlign: 'left', paddingLeft: '40px', marginBottom: '-20px' }}
            hidden={!isAssistantTyping}
          >
            <div ref={bottomRef}></div>
            <Typography color="#696a7d" style={{ marginBottom: 8 }}>
              {'Ginette is typing...'}
            </Typography>
          </Grid>
          <Grid container style={{ padding: '20px' }}>
            <Grid item xs={12}>
              <TextField
                value={inputValue}
                multiline
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                sx={{
                  boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px;',
                }}
                InputProps={{
                  sx: {
                    color: 'white',
                    fontSize: '9pt',
                  },
                  endAdornment: (
                    <IconButton
                      size="small"
                      onClick={handleSendMessage}
                      disabled={!inputValue}
                      sx={{
                        color: 'gray',
                        padding: 0,
                        marginRight: 1,
                      }}
                    >
                      <SendIcon />
                    </IconButton>
                  ),
                }}
                label=""
                fullWidth
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Snackbar
        open={alertMessage !== ''}
        autoHideDuration={6000}
        onClose={handleClose}
        message={alertMessage}
        action={action}
      />
    </>
  );
}