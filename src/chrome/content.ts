import { ChromeMessage, Sender } from "../types";

type MessageResponse = (response?: any) => void;

const validateSender = (
  message: ChromeMessage,
  sender: chrome.runtime.MessageSender
) => {
  return sender.id === chrome.runtime.id && message.from === Sender.React;
};

const getExpirianceData = (elementsArray: NodeListOf<Element>) => {
  if (!elementsArray) {
    return null;
  }
  const result = Array.from(elementsArray, (li) => {
    const isComplexExperience = li.querySelector(
      "ul.pvs-list .pvs-entity__path-node"
    );
    if (isComplexExperience) {
      const title = li.querySelector("div > div:nth-child(2) > div > a");
      const companyElement = title?.querySelector("div");
      const countryElement = title?.querySelector(
        ".t-14.t-normal.t-black--light"
      );
      const dateElement = title?.querySelector(".t-14.t-normal");
      const experienceList = li.querySelector(
        "div > div:nth-child(2) > div:nth-child(2) ul"
      );

      let currentPositionExpiriance: any[] = [];
      if (experienceList) {
        const experience = Array.from(experienceList.children).filter(
          (child) => child.tagName === "LI"
        );
        currentPositionExpiriance = Array.from(experience, (pos) => {
          const currentPositionTitleElement = pos.querySelector(
            ".t-bold .visually-hidden"
          );
          const currentPositionDateElement = pos.querySelector(
            ".t-14.t-normal.t-black--light .visually-hidden"
          );
          const currentPositionDescriptionElement = pos.querySelector(
            "div > div:nth-child(2) ul.pvs-list .pv-shared-text-with-see-more .visually-hidden"
          );
          const position = currentPositionTitleElement
            ? currentPositionTitleElement.textContent?.trim()
            : "";
          const date = currentPositionDateElement
            ? currentPositionDateElement.textContent?.trim()
            : "";
          const description = currentPositionDescriptionElement
            ? currentPositionDescriptionElement.textContent?.trim()
            : "";
          return {
            position,
            date,
            description,
          };
        });
      }

      const company = companyElement ? companyElement.textContent?.trim() : "";
      const date = dateElement ? dateElement.textContent?.trim() : "";
      const country = countryElement ? countryElement.textContent?.trim() : "";

      return {
        company,
        date,
        country,
        currentPositionExpiriance,
      };
    }
    const experience = li.querySelector("div:first-child");
    const positionElement = experience?.querySelector(
      ".t-bold .visually-hidden"
    );
    const companyElement = experience?.querySelector(".t-14.t-normal");
    const dateElement = experience?.querySelector(
      ".t-14.t-normal.t-black--light"
    );
    const position = positionElement ? positionElement.textContent?.trim() : "";
    const date = dateElement ? dateElement.textContent?.trim() : "";
    const company = companyElement ? companyElement.textContent?.trim() : "";
    return {
      position,
      date,
      company,
    };
  });
  return result;
};

const messagesFromReactAppListener = (
  message: ChromeMessage,
  sender: chrome.runtime.MessageSender,
  response: MessageResponse
) => {
  console.log("Message received:", message);

  if (message.message === "test") {
    const fullName = document.querySelector("h1");
    console.log(fullName);
    if (fullName) {
      response(fullName.innerText);
    }
  }

  if (message.message === "GetFullName") {
    const fullNameElement = document.querySelector(
      "main section[data-member-id] h1"
    );
    const positionElement = document.querySelector(
      "main section[data-member-id] .text-body-medium.break-words"
    );
    const aboutElement = document.querySelector(
      `main #about ~ .display-flex.ph5.pv3 .visually-hidden`
    );
    const experienceElements = document.querySelectorAll(
      "main #experience ~ .pvs-list__outer-container ul.pvs-list li.artdeco-list__item"
    );
    const educationElement = document.querySelectorAll(
      "main #education ~ .pvs-list__outer-container ul.pvs-list li.artdeco-list__item"
    );
    const skillsElement = document.querySelectorAll(
      "main #skills ~ .pvs-list__outer-container ul.pvs-list li.artdeco-list__item"
    );
    const experienceArray = getExpirianceData(experienceElements);
    const educationArray = Array.from(educationElement, (li) => {
      const educationPosition = li.querySelectorAll("a span.visually-hidden");
      const arr = Array.from(educationPosition, (span) => {
        return span.textContent;
      });
      return {
        name: arr[0] || "",
        type: arr[1] || "",
        date: arr[2] || "",
        description: arr[3] || "",
      };
    });
    const skillsArray = Array.from(skillsElement, (li) => {
      const skillsPosition = li.querySelector("a span.visually-hidden");
      return skillsPosition?.textContent || "";
    });
    console.log(educationArray);
    console.log(experienceArray);
    console.log(fullNameElement);
    console.log(positionElement);
    console.log(aboutElement);
    console.log(skillsArray);
    const fullName = fullNameElement ? fullNameElement.textContent?.trim() : "";
    const position = positionElement ? positionElement.textContent?.trim() : "";
    const about = aboutElement ? aboutElement.textContent?.trim() : "";
    response({
      fullName,
      position,
      about,
      experienceArray,
      educationArray,
      skillsArray,
    });
  }
};
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
