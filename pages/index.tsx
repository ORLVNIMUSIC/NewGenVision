import { useEffect, useState } from 'react';

interface IText {
  lastText: string;
  doneText: string;
}

export default function Home() {
  const [text, setText] = useState<IText>();
  const [errors, setErrors] = useState<number>(0);
  async function setData(): Promise<void> {
    const data = await (
      await fetch(`https://baconipsum.com/api/?type=meat-and-filler`)
    ).json();

    setText({
      lastText: `deete
      seases 
      se  sae` //data[Math.floor(Math.random() * data.length)]
        .replace(/\r?\n?\s+/g, ' ')
        .trim(),
      doneText: '',
    });
  }

  useEffect(() => {
    setData();
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
      <div className="textData">
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
            Accuracy: {((1 - errors / text.doneText.length) * 100).toFixed(2)} %
          </p>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
