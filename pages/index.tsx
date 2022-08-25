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

  return (
    <>
      <div className="textData">
        {text ? text : <>There is no data (yet)</>}
      </div>

      <div className="userData">
        <label>
          <input type="text" />
        </label>
      </div>
    </>
  );
}
