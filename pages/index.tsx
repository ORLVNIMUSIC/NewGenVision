import { useEffect, useState } from 'react';

export default function Home() {
  const [text, setTest] = useState([]);
  async function setData(): Promise<void> {
    setTest(
      await (
        await fetch(`https://baconipsum.com/api/?type=meat-and-filler`)
      ).json()
    );
  }
  useEffect(() => {
    setData();
  }, []);

  return (
    <>
      <div className="textData">
        {text ? (
          text[Math.floor(Math.random() * text.length)]
        ) : (
          <>There is no data (yet)</>
        )}
      </div>
    </>
  );
}
