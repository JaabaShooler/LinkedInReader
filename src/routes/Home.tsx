import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { ChromeMessage, Sender } from "../types";
import { getCurrentTabUId, getCurrentTabUrl } from "../chrome/utils";
import {Button} from "@mui/material";

export const Home = () => {
  const [url, setUrl] = useState<string>("");
  const [tabId, setTabId] = useState<number | undefined>(undefined);
  const [responseFromContent, setResponseFromContent] = useState({});

  let {push} = useHistory();

  useEffect(() => {
    const message: ChromeMessage = {
      from: Sender.React,
      message: "GetFullName",
    };
    getCurrentTabUrl((url) => {
      setUrl(url || "undefined");
    });
    getCurrentTabUId((id) => {
      setTabId(id);
      chrome.tabs.sendMessage(id as number, message, (response) => {
        console.log(response);
        setResponseFromContent(response);
      });
    });
  }, []);

  const sendGetDom = () => {
    const message: ChromeMessage = {
      from: Sender.React,
      message: "GetFullName",
    };
    console.log(tabId);
    if (tabId) {
      chrome.tabs.sendMessage(tabId as number, message, (response) => {
        console.log(response);
        setResponseFromContent(response);
      });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Home</p>
        <p>URL:</p>
        <p>{url}</p>
        <button onClick={sendGetDom}>Get DOM</button>
        <p>Response from content:</p>
        <pre>{JSON.stringify(responseFromContent, undefined, 2)}</pre>
        <Button onClick={() => {
          push("/about");
        }} variant="contained">About</Button>
      </header>
    </div>
  );
};
