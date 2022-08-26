import Image from 'next/image';
import { FC, SetStateAction, useRef, useState } from 'react';
import { IConstsCharNumber } from '../pages';
import questionMark from '../public/question-mark.svg';

const Settings: FC<{
  setGameOn: React.Dispatch<SetStateAction<boolean>>;
  setCharNumber: React.Dispatch<SetStateAction<number>>;
  charNumber: number;
  constsCharNumber: IConstsCharNumber;
}> = ({ setGameOn, charNumber, setCharNumber, constsCharNumber }) => {
  const minCharNumber: number = constsCharNumber.minCharNumber;
  const maxCharNumber: number = constsCharNumber.maxCharNumber;

  const startButton = useRef<HTMLInputElement>(null);

  return (
    <div className="settings">
      <Image
        className="questionMark"
        src={questionMark}
        width={30}
        height={30}
        title="You may choose number of characters you will enter (100-300). The timer starts when you press first key correctly. Good luck!"
        alt="Question mark"
      />
      <label>
        Choose quantity of symbols:
        <p>
          <input
            type="number"
            value={charNumber}
            onBlur={(event) => {
              if (Number(event.currentTarget.value) > maxCharNumber) {
                event.currentTarget.value = maxCharNumber.toString();
              }
              if (Number(event.currentTarget.value) < minCharNumber) {
                event.currentTarget.value = minCharNumber.toString();
              }
              setCharNumber(Number(event.currentTarget.value));
              startButton.current?.focus();
            }}
            onChange={(event) => {
              setCharNumber(Number(event.currentTarget.value));
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') event.currentTarget.blur();
            }}
          />
        </p>
        <input
          type="range"
          min={minCharNumber}
          max={maxCharNumber}
          value={charNumber}
          step={1}
          onChange={(event) => {
            startButton.current?.focus();
            setCharNumber(Number(event.currentTarget.value));
          }}
        />
      </label>
      <input
        type="button"
        value="Start game!"
        ref={startButton}
        onClick={() => {
          setGameOn(true);
        }}
      />
    </div>
  );
};

export default Settings;
