import React from 'react';
import { Box, List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography } from '@mui/material';

const SearchResult = ({ users, inputValueFetchedUser, setSingleUser, setParticipants, isGroupChat }) => {
  
  const selectedUser = (user)=> {
    if(isGroupChat){
      setParticipants((prev)=> {
        const existParticipant = prev.some((prevUser)=> prevUser?._id === user?._id);
        if(!existParticipant){
          return [...prev, user]
        }
        return prev;
      })
    }else{
      setSingleUser(user)
    }
    inputValueFetchedUser(user.username);
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 600,
        margin: '20px auto',
        backgroundColor: '#f2f2f2',
        borderRadius: 2,
        padding: 1,
        boxShadow: 2,
        display: users.length > 0 ? 'block' : 'none', // Hide the box when there are no users
        maxHeight: '200px', // Set a maximum height
        overflowY: users.length > 0 ? 'auto' : 'hidden', // Show scrollbar if users are present
      }}
    >
      <List>
        {users.length > 0 ? (
          users.map((user) => (
            <ListItem
              onClick={()=> selectedUser(user)}
              key={user._id}
              sx={{
                cursor: 'pointer',
                padding: '10px 6px',
                borderRadius: "12px",
                transition: 'background-color 0.3s',
                '&:hover': {
                  backgroundColor: '#dadada', // Add a hover effect
                },
              }}
            >
              <ListItemAvatar>
                <Avatar alt={user.username} src={user.avatar || ""} /> {/* Replace with user's avatar URL if available */}
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {user.username}
                  </Typography>
                }
              />
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText
              primary={
                <Typography variant="body2" sx={{ textAlign: 'center', color: '#888' }}>
                  No users found.
                </Typography>
              }
            />
          </ListItem>
        )}
      </List>
    </Box>
  );
};

export default SearchResult;
