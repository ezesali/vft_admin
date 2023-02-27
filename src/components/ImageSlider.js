import React, {useState} from "react";
import { IconButton } from '@mui/material';
import {IoIosArrowBack, IoIosArrowForward} from 'react-icons/io';
import {BsCircle, BsCircleFill} from 'react-icons/bs';
import {
  Modal,
  Backdrop,
  Fade
} from "@material-ui/core";
import "../App.css";

const slideStyles = {
  width: "100%",
  height: "90%",
  borderRadius: "10px",
  backgroundSize: "cover",
  backgroundPosition: "center",
  marginBottom: '20px'
};

const rightArrowStyles = {
  position: "absolute",
  top: "50%",
  transform: "translate(0, -50%)",
  right: "7px",
  fontSize: "45px",
  color: "#fff",
  zIndex: 1,
  cursor: "pointer",
};

const leftArrowStyles = {
  position: "absolute",
  top: "50%",
  transform: "translate(0, -50%)",
  left: "7px",
  cursor: "pointer",
  borderStyle: 'dashed'
};

const sliderStyles = {
  position: "relative",
  height: "100%",
};

const dotsContainerStyles = {
  display: "flex",
  justifyContent: "center",
};

const dotStyle = {
  margin: "0 3px",
  cursor: "pointer",
  fontSize: "20px",
};

const ImageSlider = ({ slides }) => {
  
  const [imageSelected, setImageSelected] = useState(null)
  const [open, setOpen] = useState(false)

  const [currentIndex, setCurrentIndex] = useState(0);
  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };
  const goToNext = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };
  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };
  const slideStylesWidthBackground = {
    ...slideStyles,
    cursor: 'pointer',
    backgroundImage: `url(${slides[currentIndex]})`,
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div style={sliderStyles}>
      <div>
        <IconButton onClick={goToPrevious} style={leftArrowStyles}>
            <IoIosArrowBack color="#fff" size={'40px'} />
        </IconButton>
        <IconButton onClick={goToNext} style={rightArrowStyles}>
            <IoIosArrowForward color="#fff" size={'40px'} />
        </IconButton>
      </div>
      <div onClick={() => {setImageSelected(slides[currentIndex]); setOpen(true)}} style={slideStylesWidthBackground}></div>
      <div style={dotsContainerStyles}>
        {slides.map((slide, slideIndex) => (
          <div
            style={dotStyle}
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}>
            {currentIndex === slideIndex ? <BsCircleFill size={'12px'}/> : <BsCircle size={'12px'}/>}
          </div>
        ))}
      </div>
      <Modal
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
          timeout: 500
          }}>
          <div onClick={handleClose} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
              <Fade in={open} timeout={500} >
                <img
                    src={imageSelected}
                    alt=""
                    style={{ maxHeight: "90%", maxWidth: "90%", zIndex: 0}}
                />
            </Fade>
          </div>
      </Modal>
    </div>
  );
};

export default ImageSlider;