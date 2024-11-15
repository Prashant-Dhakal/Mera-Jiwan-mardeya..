import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchBar() {
  return (
   <>
     <Box sx={{ width: 500, maxWidth: '100%', marginBottom: 2 }}>
      <TextField
        fullWidth
        label="Search"
        id="search"
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </Box>
   </>
  );
}
