import { useState } from "react";
import confetti from "canvas-confetti";
import * as icons from "react-icons/gi";
import { Tile } from "./Tile";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 1, scale: 0},
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { y:20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
}

const visible = { opacity: 1, y: 0, transition: {duration: 0.5} };

const itemsVariables = {
  hidden: { opacity: 0, y: 10},
  visible
}

export const possibleTileContents = [
  icons.GiHearts,
  icons.GiWaterDrop,
  icons.GiDiceSixFacesFive,
  icons.GiUmbrella,
  icons.GiCube,
  icons.GiBeachBall,
  icons.GiDragonfly,
  icons.GiHummingbird,
  icons.GiFlowerEmblem,
  icons.GiOpenBook,
];

export function StartScreen({ start }) {
  return (
    <motion.div 
    initial="hidden"
    animate="visible"
    exit={{ opacity: 0, transition: { duration: 1}}}
    variants={{ visible: {
      transition: { staggerChildren: 0.3}
    }}}
    className="mt-20 flex justify-center"
    >
    <ul className="flex flex-col items-center justify-center w-[400px]">
    <div className="bg-pink-100 pt-20 pb-20 rounded-2xl w-[400px] flex flex-col items-center justify-center">
      <motion.h1 
      variants={{ hidden: {opacity: 0, y: -20}, visible}}
      className="text-3xl text-center pt-10 text-pink-500 font-bold mb-10">
        Memory
      </motion.h1>

      <motion.li variants={itemsVariables} className="text-center text-pink-500 mb-5 text-[20px]">
        Flip over tiles looking for pairs
      </motion.li>
      
      <motion.li variants={itemsVariables} className="flex justify-center pb-10">
      <button onClick={start} className="bg-pink-500 text-white p-3 px-6 w-[140px] font-medium rounded-md">
        Play
      </button>
      </motion.li>
    </div>
    </ul>

    </motion.div>
  );
}

export function PlayScreen({ end }) {
  const [tiles, setTiles] = useState(null);
  const [tryCount, setTryCount] = useState(0);

  const getTiles = (tileCount) => {
    // Throw error if count is not even.
    if (tileCount % 2 !== 0) {
      throw new Error("The number of tiles must be even.");
    }

    // Use the existing list if it exists.
    if (tiles) return tiles;

    const pairCount = tileCount / 2;

    // Take only the items we need from the list of possibilities.
    const usedTileContents = possibleTileContents.slice(0, pairCount);

    // Double the array and shuffle it.
    const shuffledContents = usedTileContents
      .concat(usedTileContents)
      .sort(() => Math.random() - 0.5)
      .map((content) => ({ content, state: "start" }));

    setTiles(shuffledContents);
    return shuffledContents;
  };

  const flip = (i) => {
    // Is the tile already flipped? We don’t allow flipping it back.
    if (tiles[i].state === "flipped") return;

    // How many tiles are currently flipped?
    const flippedTiles = tiles.filter((tile) => tile.state === "flipped");
    const flippedCount = flippedTiles.length;

    // Don't allow more than 2 tiles to be flipped at once.
    if (flippedCount === 2) return;

    // On the second flip, check if the tiles match.
    if (flippedCount === 1) {
      setTryCount((c) => c + 1);

      const alreadyFlippedTile = flippedTiles[0];
      const justFlippedTile = tiles[i];

      let newState = "start";

      if (alreadyFlippedTile.content === justFlippedTile.content) {
        confetti({
          ticks: 100,
        });
        newState = "matched";
      }

      // After a delay, either flip the tiles back or mark them as matched.
      setTimeout(() => {
        setTiles((prevTiles) => {
          const newTiles = prevTiles.map((tile) => ({
            ...tile,
            state: tile.state === "flipped" ? newState : tile.state,
          }));

          // If all tiles are matched, the game is over.
          if (newTiles.every((tile) => tile.state === "matched")) {
            setTimeout(end, 0);
          }

          return newTiles;
        });
      }, 1000);
    }

    setTiles((prevTiles) => {
      return prevTiles.map((tile, index) => ({
        ...tile,
        state: i === index ? "flipped" : tile.state,
      }));
    });
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        
        <p className="mb-8 text-lg font-medium text-blue-400">
          Tries <span className="px-2 bg-indigo-200 text-indigo-500 rounded-md">{tryCount}</span>
        </p>

        <motion.ul
    
    variants={container}
    initial="hidden"
    animate="visible"
  >
      <div className="px-2 py-2 border-none w-[370px] h-[380px] bg-blue-50 rounded-2xl">
        <div className="flex flex-wrap mt-[5px] ml-[1px] gap-[10px] w-full">
          {getTiles(16).map((tile, i) => (
            <motion.li key={i}  className="item" variants={item} >
            <Tile  flip={() => flip(i)} {...tile}/>
            </motion.li>
          ))}
        </div>
      </div>

      </motion.ul>

        
      </div>
      
    </>
  );
}
