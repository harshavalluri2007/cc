import React, { useState, useEffect } from "react";
import { Grid, Typography, Container, Box, MenuItem, Select } from "@mui/material";
import ScoreModal from "./ScoreModal";
import { motion } from "framer-motion";
import { StyledGridItem, ResetGameButton, MovesDisplay, TimeDisplay, MemoryMatchCard } from "./StyledComponents";
import emoji from "./emoji.json";

const MemoryMatch = () => {
  // Declare state variables
  const emojiList = emoji;
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([0]);
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [openScoreModal, setOpenScoreModal] = useState(false);
  const [selectedEmojiList, setSelectedEmojiList] = useState(emojiList[0].emoji);
  const [score, setScore] = useState(0);
  // Shuffle the cards on component mount
  useEffect(() => {
    shuffleCards();
    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEmojiList]);

  // Open score modal when all cards are matched
  useEffect(() => {
    if (matched.length === cards.length) {
      setOpenScoreModal(true);
    }
  }, [matched, cards, moves]);
  // Close the score modal
  const closeModal = () => {
    setOpenScoreModal(false);
  };

  // Increment the time elapsed every second while there are unmatched cards
  useEffect(() => {
    if (matched.length < cards.length) {
      const timer = setTimeout(() => setTimeElapsed(timeElapsed + 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeElapsed, matched, cards]);

  // Shuffle the cards and reset the game
  const shuffleCards = () => {
    const shuffled = selectedEmojiList.concat(selectedEmojiList).sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setSelected([]);
    setMatched([]);
    setMoves(0);
    setTimeElapsed(0);
  };

  // Select a card and check for matches

  const selectCard = (index) => {
    // Don't allow selection of more than two cards or the same card twice
    if (selected.length === 2 || selected.includes(index) || matched.includes(index)) {
      return;
    }
    setSelected([...selected, index]);
    if (selected.length === 1) {
      setMoves(moves + 1);
      
      if (cards[selected[0]] === cards[index]) {
        setMatched([...matched, selected[0], index]);
        setSelected([]);
        setScore(score+1)
        // play audio with 0.5 seconds delay
        setTimeout(() => {
        }, 600);
        //if(isMuted) new Audio(cardMatch).play();
      } else {
        // Unflip the cards after 1 second if they don't match
        setTimeout(() => {
          setSelected([]);
        }, 1000);
      }
    }
  };

  const handleChangeEmoji = (event) => {
    console.log(event.target.value);
    setSelectedEmojiList(event.target.value);
  };

  return (
    <Container maxWidth="md">
      <ScoreModal open={openScoreModal} handleClose={closeModal} moves={moves} timeElapsed={timeElapsed} />
      <Box textAlign="center" my={2}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Memory Match Game
        </Typography>
        <Typography variant="body1">
          Click on the cards to reveal them, and find matching pairs. <br /> Try to complete the game in the shortest time and with the fewest moves!
        </Typography>
      </Box>
      <Grid container justifyContent="center" alignItems="center" spacing={2} style={{ marginTop: "1rem" }}>
        <Grid item>
          <ResetGameButton shuffleCards={shuffleCards} />
        </Grid>

        <Grid item>
          <Select
            value={selectedEmojiList}
            onChange={handleChangeEmoji}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            style={{ width: "16rem" }}
          >
            {emojiList.map((emoji, index) => (
              <MenuItem key={index} value={emoji.emoji}>
                {emoji.title}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        <StyledGridItem item>
        </StyledGridItem>

        <Grid item>
          <MovesDisplay moves={moves} />
        </Grid>
        <Grid item>
          <TimeDisplay timeElapsed={timeElapsed} />
        </Grid>
      </Grid>

      <Grid container spacing={2} justifyContent="center" alignItems="center" style={{ marginTop: "1rem" }}>
        {/* Map over the cards and create a MemoryMatchCard for each one */}
        {cards.map((card, index) => (
          <Grid item xs={4} sm={3} md={2} key={index}>
            <motion.div
              style={{
                transformStyle: "preserve-3d",
                padding: "0.5rem",
              }}
              animate={{
                rotateY: matched.includes(index) || selected.includes(index) ? -180 : 0,
              }}
              transition={{ duration: 0.7 }}
              key={index}
            >
              <MemoryMatchCard key={index} card={card} index={index} selected={selected} matched={matched} selectCard={selectCard} />
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Box textAlign="center" my={2}>
  <Typography variant="h4" gutterBottom fontWeight="bold">
    Memory Match Game
  </Typography>
  <Typography variant="body1">
    Click on the cards to reveal them, and find matching pairs. <br /> Try to complete the game in the shortest time and with the fewest moves!
  </Typography>
  <Typography variant="h6" gutterBottom>
    Total Score: {score}
  </Typography>
  <Typography variant="h6" gutterBottom>
    Moves: {moves}
  </Typography>
  <Typography variant="h6" gutterBottom>
    Time Elapsed: {timeElapsed} seconds
  </Typography>
</Box>
    </Container>
  );
};

export default MemoryMatch;