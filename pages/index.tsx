import { useEffect, useRef, useState } from 'react';

interface IText {
  lastText: string;
  doneText: string;
}

export default function Home() {
  const minCharNumber: number = 100;
  const maxCharNumber: number = 300;

  const [text, setText] = useState<IText>();
  const [errors, setErrors] = useState<number>(0);
  const [charNumber, setCharNumber] = useState<number>(minCharNumber);
  const [gameOn, setGameOn] = useState<boolean>(false);

  const refText = useRef<HTMLDivElement>(null);

  async function fetchData(): Promise<void> {
    const data = await (
      await fetch(`https://baconipsum.com/api/?type=meat-and-filler`)
    ).json();

    setText({
      lastText: data[Math.floor(Math.random() * data.length)]
        .replace(/\r?\n?\s+/g, ' ')
        .trim()
        .substr(0, charNumber),
      doneText: '',
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  function handleKeyPress(event: KeyboardEvent): void {
    console.log(text);

    if (text) {
      console.log(event.key);
      if (event.key !== 'Shift') {
        if (event.key === text.lastText[0])
          setText({
            lastText: text.lastText.slice(1),
            doneText: text.doneText.concat(event.key),
          });
        else {
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

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [text]);

  return (
    <div className="container">
      {gameOn ? (
        <>
          <div className="textData" ref={refText}>
            <b className="doneText">{text ? text.doneText : <></>}</b>
            {text ? (
              <b className="lastTextFirstLetter">{text.lastText[0]}</b>
            ) : (
              <></>
            )}
            {text ? text.lastText.slice(1) : <>There is no data (yet)</>}
          </div>
          {text?.lastText ? (
            <></>
          ) : text ? (
            <div className="results">
              <h3>Your score:</h3>
              <p>Errors: {errors}</p>
              <p>
                Accuracy:{' '}
                {((1 - errors / text.doneText.length) * 100).toFixed(2)} %
              </p>
              <input
                type="button"
                value="Start again!"
                onClick={() => {
                  setGameOn(!gameOn);
                }}
              />
            </div>
          ) : (
            <></>
          )}
        </>
      ) : (
        <div className="settings">
          <label>
            Choose quantity of symbols: {charNumber}
            <input
              type="range"
              min={minCharNumber}
              max={maxCharNumber}
              defaultValue={minCharNumber}
              step={1}
              onChange={(event) => {
                setCharNumber(Number(event.currentTarget.value));
              }}
            />
          </label>
          <input
            type="button"
            value="Start game!"
            onClick={() => {
              fetchData();
              setErrors(0);
              setGameOn(!gameOn);
            }}
          />
        </div>
      )}
    </div>
  );
}
