import { useState } from 'react';
import Game from '../components/game';
import Settings from '../components/settings';

export interface IConstsCharNumber {
  minCharNumber: number;
  maxCharNumber: number;
}

export default function Home() {
  const constsCharNumber: IConstsCharNumber = {
    minCharNumber: 100,
    maxCharNumber: 300,
  };

  const [gameOn, setGameOn] = useState<boolean>(false);
  const [charNumber, setCharNumber] = useState<number>(
    constsCharNumber.minCharNumber
  );

  return (
    <div className="container">
      {gameOn ? (
        <Game setGameOn={setGameOn} charNumber={charNumber} />
      ) : (
        <Settings
          setGameOn={setGameOn}
          charNumber={charNumber}
          setCharNumber={setCharNumber}
          constsCharNumber={constsCharNumber}
        />
      )}
    </div>
  );
}
