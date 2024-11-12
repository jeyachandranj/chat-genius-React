import React, { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { FaPencilAlt } from 'react-icons/fa';
import { FaBook } from "react-icons/fa";
import { FaExpandArrowsAlt } from "react-icons/fa";
import { CiText} from "react-icons/ci";
import { IoMdSend } from "react-icons/io";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import { FaSyncAlt, FaTimes } from 'react-icons/fa';
import Groq from "groq-sdk";




export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const groq = new Groq({ apiKey: "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", dangerouslyAllowBrowser: true });


  const handleEmojiClick = (event, emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };
  const [modal, setModal] = useState(false);
  const [modalData, setModalData] = useState({});

  const toggleModal = () => {
    setModal(false);
  }
  const textProcessing = async (title) => {
    let content = " ";
      if (true) {
        let systemcontent = msg;
        switch (title) {
          case "TRANSLATE":
            systemcontent = "Translate the following sentence into Tamil without adding any additional words: " + msg;
            break;
          case "REPHRASE":
            systemcontent = "Rephrase the following message with proper grammar and spelling to make it sound natural and conversational.";
            break;
          case "SUMMARY":
            systemcontent = "Summarize the following content in a concise and clear manner.";

            console.log("It's Wednesday!");
            break;
          case "EXPAND":
            systemcontent = "Expand the following brief sentence into a complete, coherent message of up to 100 words, ensuring it reads naturally and engagingly.";
            break;
          default:
            console.log("It's the weekend!");
        }
  
      try {
        const response = await groq.chat.completions.create({
          messages: [
            { role: "system", content: systemcontent },
            { role: "user", content: msg },
          ],
          model: "llama3-8b-8192",
          temperature: 0.7,
        });
  
        if (response.choices && response.choices.length > 0) {
content = response.choices[0]?.message?.content;
          switch (title) {
            case "REPHRASE":
              setMsg(content);
              break;
            default:
          }
          setModalData({
            title: title, // Assuming your response has a "title" field
            content: content, // Assuming your response has a "content" field
          });
          console.log(content);
        } else {
          console.log("Invalid API response or no choices found.");
          setModalData({
            title: title, // Assuming your response has a "title" field
            content: "API did not respond; please try again.", // Default error message
          });
        }
        console.log("data", response);
      } catch (error) {
        // Handle any errors that occur during the API request
        setModalData({
          title: title, // Assuming your response has a "title" field
          content: "An exception occurred.", // Custom error message
        });
        console.error("Error:", error);
      }
    }
    setModal(true);
  };

  if(modal) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }

  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
        </div>
        <div className="emoji">
          <FaPencilAlt onClick={() => textProcessing("REPHRASE")}/>
        </div>
        <div className="emoji">
          <CiText onClick={() => textProcessing("TRANSLATE")} />
        </div>
        <div className="emoji">
        <FaBook onClick={() => textProcessing("SUMMARY")} />
        </div>
        <div className="emoji">
          <FaExpandArrowsAlt onClick={() => textProcessing("EXPAND")}/>
        </div>
      </div>
      <div style={{"padding-left":"150px"}}>
      <form className="input-container" onSubmit={(event) => sendChat(event)}>
        <input
          type="text"
          placeholder="type your message here"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <button type="submit">
          <IoMdSend />
        </button>
      </form>
      </div>
      {modal && (
        <div className="modal">
          <div className="modal-content">
            <button className="refresh-modal" onClick={() => textProcessing(modalData.title)}>
              <FaSyncAlt /> {/* React Icons "Refresh" icon */}
            </button>
            <h2>{modalData.title}</h2>
            <p>
              {modalData.content}
            </p>
            <button className="close-modal" onClick={toggleModal}>
              <FaTimes /> {/* React Icons "Close" icon */}
            </button>
          </div>
        </div>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 5% 95%;
  background-color: #080420;
  padding: 0 2rem;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }
  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    .emoji {
      position: relative;
      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
        cursor: pointer;
      }
      .emoji-picker-react {
        position: absolute;
        top: -350px;
        background-color: #080420;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9a86f3;
        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #080420;
          width: 5px;
          &-thumb {
            background-color: #9a86f3;
          }
        }
        .emoji-categories {
          button {
            filter: contrast(0);
          }
        }
        .emoji-search {
          background-color: transparent;
          border-color: #9a86f3;
        }
        .emoji-group:before {
          background-color: #080420;
        }
      }
    }
  }
  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;
    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;

      &::selection {
        background-color: #9a86f3;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border: none;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }
      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }
`;
