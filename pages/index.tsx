import { useEffect, useRef, useState } from 'react';

interface IText {
  lastText: string;
  doneText: string;
}

interface ITimer {
  startTimer: number | undefined;
  endTimer: number | undefined;
}

export default function Home() {
  const minCharNumber: number = 100;
  const maxCharNumber: number = 300;

  const [text, setText] = useState<IText>();
  const [errors, setErrors] = useState<number>(0);
  const [charNumber, setCharNumber] = useState<number>(minCharNumber);
  const [gameOn, setGameOn] = useState<boolean>(false);
  const [timer, setTimer] = useState<ITimer>();

  const refText = useRef<HTMLDivElement>(null);
  const startButton = useRef<HTMLInputElement>(null);

  async function fetchData(): Promise<void> {
    const data = await (
      await fetch(`https://baconipsum.com/api/?type=meat-and-filler`)
    ).json();

    setText({
      lastText: data
        .join(' ')
        .replace(/\r?\n?\s+/g, ' ')
        .trim()
        .substr(0, charNumber),
      doneText: '',
    });
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [text]);

  function handleKeyPress(event: KeyboardEvent): void {
    if (text && text.lastText) {
      if (event.key !== 'Shift') {
        if (event.key === text.lastText[0]) {
          if (text.lastText.length == 1) {
            setTimer({
              startTimer: timer?.startTimer,
              endTimer: Date.now(),
            });
            document.removeEventListener('keydown', handleKeyPress);
          }
          if (text.doneText.length == 0) {
            setTimer({
              startTimer: Date.now(),
              endTimer: undefined,
            });
          }
          setText({
            lastText: text.lastText.slice(1),
            doneText: text.doneText.concat(event.key),
          });
        } else {
          setErrors((prev) => prev + 1);
          refText.current!.classList.toggle('shakingComponent');
          const shakeTimer: NodeJS.Timeout = setTimeout(() => {
            refText.current!.classList.toggle('shakingComponent');
            clearTimeout(shakeTimer);
          }, 500);
        }
      }
    }
  }

  return (
    <div className="container">
      {gameOn ? (
        <>
          <div className="game">
            {text ? (
              <>
                <div className="textData" ref={refText}>
                  <span className="doneText">
                    {text ? text.doneText : <></>}
                  </span>
                  {text ? (
                    <span className="lastTextFirstLetter">
                      {text.lastText[0]}
                    </span>
                  ) : (
                    <></>
                  )}
                  {text ? text.lastText.slice(1) : <></>}
                </div>
                {text?.lastText ? (
                  <>
                    <input
                      type="button"
                      value="End game"
                      onClick={() => {
                        document.removeEventListener('keydown', handleKeyPress);
                        setText(undefined);
                        setGameOn(false);
                      }}
                    />
                  </>
                ) : text ? (
                  <div className="results">
                    <h3>Your score:</h3>
                    <p>Errors: {errors}</p>
                    <p>
                      Accuracy:{' '}
                      {((1 - errors / text.doneText.length) * 100).toFixed(2)} %
                    </p>
                    <p>
                      Time: {(timer?.endTimer! - timer?.startTimer!) / 1000}{' '}
                      seconds
                    </p>
                    <input
                      type="button"
                      value="Start again!"
                      onClick={() => {
                        setText(undefined);
                        setGameOn(false);
                      }}
                    />
                  </div>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <div className="lds-dual-ring" />
            )}
          </div>
        </>
      ) : (
        <div className="settings" onClick={() => {}}>
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
              fetchData();
              setErrors(0);
              setGameOn(true);
            }}
          />
        </div>
      )}
    </div>
  );
}
