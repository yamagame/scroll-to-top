import React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import "./App.css";

const baseUrl = import.meta.env.BASE_URL;
console.log(`baseUrl ${baseUrl}`);

function ScrollToTop({ page }: { page: string }) {
  React.useEffect(() => {
    console.log("scrollTo A1", page, window.scrollY, window.location);
    window.scrollTo(0, 0);
    console.log("scrollTo A2", page, window.scrollY, window.location);
    let c = 0;
    const check = () => {
      setTimeout(() => {
        console.log(`scrollTo A2-${c}`, page, window.scrollY, window.location);
        c++;
        if (c < 10) check();
      }, 2);
    };
    check();
  }, [page]);
  return null;
}

function Page({ title, onNext }: { title: string; onNext: () => void }) {
  const next = () => {
    window.open(`${baseUrl}dialog`);
    window.onmessage = (e) => {
      if (e.data === 0) {
        onNext();
        return;
      }
      setTimeout(() => {
        onNext();
      }, e.data);
    };
  };

  return (
    <div>
      <div className="page">
        <div className="page-container">{title}</div>
      </div>
      <div className="page-margin">
        {title}
        <div>
          <input className="button" type="button" onClick={next} value="Next" />
        </div>
      </div>
    </div>
  );
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const post = (delay: number) => {
    window.opener.postMessage(delay);
    window.close();
  };

  return (
    <Routes>
      <Route
        path={`${baseUrl}dialog`}
        element={
          <>
            <input className="button" type="button" onClick={() => post(0)} value="Close" />
            <input className="button" type="button" onClick={() => post(10)} value="Delay 10" />
            <input className="button" type="button" onClick={() => post(30)} value="Delay 30" />
            <input className="button" type="button" onClick={() => post(100)} value="Delay 100" />
          </>
        }
      />
      <Route
        path={`${baseUrl}page2`}
        element={
          <>
            <ScrollToTop page={location.pathname} />
            <Page title={location.pathname} onNext={() => navigate("/page1")} />
          </>
        }
      />
      <Route
        path={`${baseUrl}*`}
        element={
          <>
            <ScrollToTop page={location.pathname} />
            <Page title={location.pathname} onNext={() => navigate("/page2")} />
          </>
        }
      />
    </Routes>
  );
}

export default App;
