import { useEffect, useState } from 'react';

interface IText {
  lastText: string;
  doneText: string;
}

export default function Home() {
  const [text, setText] = useState<IText>();
  async function setData(): Promise<void> {
    const data = await (
      await fetch(`https://baconipsum.com/api/?type=meat-and-filler`)
    ).json();

    setText({
      lastText: data[Math.floor(Math.random() * data.length)],
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
      if (event.key !== 'Shift' && event.key === text.lastText[0]) {
        setText({
          lastText: text.lastText.slice(1),
          doneText: text.doneText.concat(event.key),
        });
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
    <>
      <div className="textData">
        {text ? text.doneText : <>There is no data (yet)</>}
        {text ? text.lastText : <>There is no data (yet)</>}
      </div>
    </>
  );
}
