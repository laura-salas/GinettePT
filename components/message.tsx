import React, { ReactNode } from 'react';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import SyntaxHighlighter from 'react-syntax-highlighter';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: '100%',
    height: '80vh',
  },
  headBG: {
    backgroundColor: '#e0e0e0',
  },
  borderRight500: {
    borderRight: '1px solid #e0e0e0',
  },
  messageArea: {
    height: '70vh',
    overflowY: 'auto',
  },
});

interface MessageProps {
  id?: number;
  content?: ReactNode;
  type?: 'Q' | 'A';
}

const Message: React.FC<MessageProps> = ({ id, content, type }) => {
  const classes = useStyles();
  let color: string;
  let align: 'right' | 'left';

  if (type === 'Q') {
    color = '#6e85b5';
    align = 'right';
  } else {
    color = '#86c497';
    align = 'left';
  }

  // const contentChildrenArray = React.Children.toArray(content?.props.children);

  // Check if any of the children are instances of SyntaxHighlighter
  const containsSyntaxHighlighter = false;// contentChildrenArray.some(
    // (child) => (child as React.ReactElement).type === SyntaxHighlighter
  // );

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
        padding: '10px 20px',
      }}
    >
      <Box
        sx={{
          bgcolor: color,
          borderRadius: '15px',
          width: containsSyntaxHighlighter ? '55%' : 'fit-content',
          maxWidth: '55%',
          fontFamily: 'Roboto',
          color: 'white',
        }}
      >
        <ListItem key={id}>
          <Grid container>
            <Grid item xs={12}>
              <ListItemText sx={{align: align}}  primary={content}></ListItemText>
            </Grid>
          </Grid>
        </ListItem>
      </Box>
    </Box>
  );
};

export default Message;
