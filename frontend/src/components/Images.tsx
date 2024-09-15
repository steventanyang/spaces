import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const StoryOverlay = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7); /* Dark overlay */
  backdrop-filter: blur(10px); /* Blur effect for background */
  display: ${(props) => (props.visible ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  z-index: 10000;
`;

const StoryContainer = styled.div`
  position: relative;
  max-width: 400px;
  width: 100%;
  background: #000;
  border-radius: 10px;
  overflow: hidden;
`;

const StoryImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  cursor: pointer;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
`;

const ProgressContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: rgba(255, 255, 255, 0.3);
`;

const Progress = styled.div<{ progress: number }>`
  width: ${(props) => props.progress}%;
  height: 100%;
  background: #fff;
`;

interface SnapStoryProps {
  images: string[];
  visible: boolean;
  onClose: () => void;
}

const SnapStory: React.FC<SnapStoryProps> = ({ images, visible, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!visible) {
      setCurrentImageIndex(0); // Reset image index when the story becomes invisible
    }
  }, [visible]);

  // Handles clicking on the image
  const handleImageClick = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      onClose(); // Close the story if it's the last image
    }
  };

  const progress = ((currentImageIndex + 1) / images.length) * 100;

  return (
    <StoryOverlay visible={visible}>
      <StoryContainer>
        <CloseButton onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </CloseButton>
        <ProgressContainer>
          <Progress progress={progress} />
        </ProgressContainer>
        <StoryImage
          src={images[currentImageIndex]}
          alt="Snap Story"
          onClick={handleImageClick} // Move to next image on click
        />
      </StoryContainer>
    </StoryOverlay>
  );
};

export default SnapStory;
