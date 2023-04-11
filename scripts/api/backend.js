export const saveMessages = async (messages) => {
  // ensure we are not saving any null messages
  const filteredMessages = messages.filter((message) => message != null);

  const response = await fetch('/api/save-messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(filteredMessages),
  });

  if (response.ok) {
    return true;
  } else {
    throw new Error('Failed to save messages');
  }
};

export const clearMessages = async () => {
  const response = await fetch('/api/clear-messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    return true;
  } else {
    throw new Error('Failed to clear messages');
  }
};

export const loadMessages = async () => {
  return new Promise((resolve, reject) => {
    fetch('/api/messages')
      .then((response) => response.text()) // Change this line to read the response as text
      .then((text) => {
        if (text === '') {
          resolve([]);
        } else {
          resolve(JSON.parse(text));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export async function send(message) { 
    // flask
    try {
      const response = await fetch('http://localhost:5000/api/backend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message }),
      });
       
        const responseData = await response.json();
        // Process the response data and add the response message to the messages array
        const responseMessage = {
          id: 0,
          content: responseData.response,  
          type: 'A',
        }; 
        return responseMessage;
      } catch (error) {
        console.error('Error calling the Flask API:', error);
      }
}