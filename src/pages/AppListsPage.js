
import React from 'react';

const AppListsPage = () => {
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      backgroundColor: 'white',
      color: 'black'
    }}>
      {/* Left Menu Pane */}
      <div style={{
        width: '20%',
        border: '1px solid red',
        padding: '10px',
        boxSizing: 'border-box'
      }}>
        <h2>Left Menu Pane</h2>
      </div>

      {/* Main Content Wrapper */}
      <div style={{
        width: '80%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid red',
        padding: '10px',
        boxSizing: 'border-box'
      }}>
        {/* Header Menu Pane */}
        <div style={{
          height: '10%',
          border: '1px solid red',
          marginBottom: '10px',
          padding: '10px',
          boxSizing: 'border-box'
        }}>
          <h3>Header Menu Pane</h3>
        </div>

        {/* Main Content Pane */}
        <div style={{
          flexGrow: 1,
          border: '1px solid red',
          padding: '10px',
          boxSizing: 'border-box'
        }}>
          <h3>Main Content Pane</h3>
        </div>
      </div>
    </div>
  );
};

export default AppListsPage;
