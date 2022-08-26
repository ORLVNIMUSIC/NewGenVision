import { FC, SetStateAction, useRef, useState } from 'react';
import { IConstsCharNumber } from '../pages';

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
