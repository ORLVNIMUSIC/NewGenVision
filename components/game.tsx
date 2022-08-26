import { FC, SetStateAction, useEffect, useRef, useState } from 'react';

interface IText {
  lastText: string;
  doneText: string;
}

interface ITimer {
  startTimer: number | undefined;
  endTimer: number | undefined;
}

const Game: FC<{
  setGameOn: React.Dispatch<SetStateAction<boolean>>;
  charNumber: number;
}> = ({ setGameOn, charNumber }) => {
  const [text, setText] = useState<IText>();
  const [errors, setErrors] = useState<number>(0);

  const [timer, setTimer] = useState<ITimer>();

  const refText = useRef<HTMLDivElement>(null);

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
    fetchData();
    setErrors(0);
  }, []);

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

  return text ? (
    <div className="game">
      <div className="textData" ref={refText}>
        <span className="doneText">{text ? text.doneText : <></>}</span>
        {text ? (
          <span className="lastTextFirstLetter">{text.lastText[0]}</span>
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
            Accuracy: {((1 - errors / text.doneText.length) * 100).toFixed(2)} %
          </p>
          <p>Time: {(timer?.endTimer! - timer?.startTimer!) / 1000} seconds</p>
          <p>
            Speed:{' '}
            {(
              charNumber /
              ((timer?.endTimer! - timer?.startTimer!) / 1000)
            ).toFixed(2)}{' '}
            characters per second
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
    </div>
  ) : (
    <div className="lds-dual-ring" />
  );
};

export default Game;
