import { useEffect, useState } from 'react';

export default function Home() {
  const [text, setTest] = useState('');
  async function setData(): Promise<void> {
    const data = await (
      await fetch(`https://baconipsum.com/api/?type=meat-and-filler`)
    ).json();

    setTest(data[Math.floor(Math.random() * data.length)]);
  }

  useEffect(() => {
    setData();
  }, []);

  function handleKeyPress(event: KeyboardEvent) {
    console.log(event.key);
    if (event.key !== 'Shift') {
      console.log('check');
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  });

  return (
    <>
      <div className="textData">
        {text ? text : <>There is no data (yet)</>}
      </div>
    </>
  );
}
