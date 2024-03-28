import { BrowserRouter, Routes, Route, Link} from "react-router-dom";

/* NEED TO EDIT THIS!! JUST OUTLINE FOR NOW */


import HomePage from './pages/HomePage.js';
import ClassPage from './pages/ClassPage.js';


// App is the root component of our application and as children contain all our pages
// We use React Router's BrowserRouter and Routes components to define the pages for
// our application, with each Route component representing a page and the common
// NavBar component allowing us to navigate between pages (with hyperlinks)
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}